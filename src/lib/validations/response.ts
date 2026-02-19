import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function apiForbidden(message = 'O registro solicitado não pertence ao seu perfil') {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function apiUnauthorized(message = 'Não autenticado') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function apiValidationError(errors: Record<string, string[]>) {
  return NextResponse.json({ error: 'Erro de validação', details: errors }, { status: 422 });
}
