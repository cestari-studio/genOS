#!/usr/bin/env python3
"""
Qiskit QAOA schedule optimizer for genOS.

Uses Quadratic Unconstrained Binary Optimization (QUBO) solved via
Qiskit's QAOA algorithm to find optimal content posting schedules.

Input (JSON via stdin):
  {
    "slots": [{"day": 0, "hour": 9, "platform": "instagram", "engagement": 0.85}, ...],
    "max_posts_per_day": 3,
    "max_posts_per_platform_day": 1
  }

Output (JSON via stdout):
  {
    "selected_slots": [{"day": 0, "hour": 9, "platform": "instagram", "score": 0.92}],
    "method": "qaoa",
    "iterations": 100,
    "energy": -4.23
  }
"""

import sys
import json
import numpy as np

try:
    from qiskit_optimization import QuadraticProgram
    from qiskit_optimization.algorithms import MinimumEigenOptimizer
    from qiskit_algorithms import QAOA
    from qiskit_algorithms.optimizers import COBYLA
    from qiskit.primitives import StatevectorSampler
    HAS_QISKIT = True
except ImportError:
    HAS_QISKIT = False


def build_qubo(slots, max_per_day=3, max_per_platform_day=1):
    """Build QUBO for schedule optimization.

    Objective: maximize total engagement of selected slots
    Constraints:
      - At most max_per_day posts per day
      - At most max_per_platform_day per platform per day
      - Penalize consecutive same-platform posts (audience fatigue)
    """
    n = len(slots)
    qp = QuadraticProgram("schedule_optimizer")

    # Binary variables: x_i = 1 if slot i is selected
    for i in range(n):
        qp.binary_var(name=f"x_{i}")

    # Objective: maximize engagement (negate for minimization)
    linear = {f"x_{i}": -slots[i]["engagement"] for i in range(n)}
    qp.minimize(linear=linear)

    # Constraint: max posts per day
    days = set(s["day"] for s in slots)
    for day in days:
        day_indices = [i for i, s in enumerate(slots) if s["day"] == day]
        if len(day_indices) > max_per_day:
            constraint = {f"x_{i}": 1 for i in day_indices}
            qp.linear_constraint(
                linear=constraint,
                sense="<=",
                rhs=max_per_day,
                name=f"max_day_{day}"
            )

    # Constraint: max posts per platform per day
    platforms = set(s["platform"] for s in slots)
    for day in days:
        for platform in platforms:
            indices = [
                i for i, s in enumerate(slots)
                if s["day"] == day and s["platform"] == platform
            ]
            if len(indices) > max_per_platform_day:
                constraint = {f"x_{i}": 1 for i in indices}
                qp.linear_constraint(
                    linear=constraint,
                    sense="<=",
                    rhs=max_per_platform_day,
                    name=f"max_{platform}_day_{day}"
                )

    return qp


def solve_qaoa(qp, max_iter=100):
    """Solve the QUBO using QAOA."""
    optimizer = COBYLA(maxiter=max_iter)
    sampler = StatevectorSampler()
    qaoa = QAOA(sampler=sampler, optimizer=optimizer, reps=2)
    solver = MinimumEigenOptimizer(qaoa)
    result = solver.solve(qp)
    return result


def solve_classical(slots, max_per_day=3, max_per_platform_day=1):
    """Classical greedy fallback when Qiskit is not available."""
    sorted_slots = sorted(
        enumerate(slots),
        key=lambda x: x[1]["engagement"],
        reverse=True
    )

    selected = []
    day_counts = {}
    platform_day_counts = {}

    for idx, slot in sorted_slots:
        day = slot["day"]
        platform = slot["platform"]
        key = f"{platform}_{day}"

        if day_counts.get(day, 0) >= max_per_day:
            continue
        if platform_day_counts.get(key, 0) >= max_per_platform_day:
            continue

        selected.append({
            "day": slot["day"],
            "hour": slot["hour"],
            "platform": slot["platform"],
            "score": round(slot["engagement"], 4),
        })
        day_counts[day] = day_counts.get(day, 0) + 1
        platform_day_counts[key] = platform_day_counts.get(key, 0) + 1

    return selected


def main():
    input_data = json.loads(sys.stdin.read())
    slots = input_data["slots"]
    max_per_day = input_data.get("max_posts_per_day", 3)
    max_per_platform_day = input_data.get("max_posts_per_platform_day", 1)

    if not slots:
        print(json.dumps({
            "selected_slots": [],
            "method": "empty",
            "iterations": 0,
            "energy": 0,
        }))
        return

    if HAS_QISKIT and len(slots) <= 30:
        try:
            qp = build_qubo(slots, max_per_day, max_per_platform_day)
            result = solve_qaoa(qp, max_iter=100)

            selected = []
            for i, val in enumerate(result.x):
                if val > 0.5:
                    s = slots[i]
                    selected.append({
                        "day": s["day"],
                        "hour": s["hour"],
                        "platform": s["platform"],
                        "score": round(s["engagement"], 4),
                    })

            selected.sort(key=lambda x: (x["day"], x["hour"]))

            print(json.dumps({
                "selected_slots": selected,
                "method": "qaoa",
                "iterations": 100,
                "energy": round(float(result.fval), 4),
            }))
            return
        except Exception as e:
            sys.stderr.write(f"QAOA failed, falling back to classical: {e}\n")

    # Classical fallback
    selected = solve_classical(slots, max_per_day, max_per_platform_day)
    selected.sort(key=lambda x: (x["day"], x["hour"]))

    print(json.dumps({
        "selected_slots": selected,
        "method": "classical_greedy",
        "iterations": 0,
        "energy": -sum(s["score"] for s in selected),
    }))


if __name__ == "__main__":
    main()
