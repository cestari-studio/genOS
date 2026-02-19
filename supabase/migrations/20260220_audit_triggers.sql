-- Generic audit trigger function
CREATE OR REPLACE FUNCTION cestari.fn_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cestari.audit_log (organization_id, action, details)
  VALUES (
    COALESCE(NEW.org_id, NEW.organization_id),
    TG_ARGV[0] || '.' || TG_OP,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'record_id', NEW.id,
      'operation', TG_OP
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit triggers to core tables
DROP TRIGGER IF EXISTS trg_audit_content_items ON cestari.content_items;
CREATE TRIGGER trg_audit_content_items
  AFTER INSERT OR UPDATE OR DELETE ON cestari.content_items
  FOR EACH ROW EXECUTE FUNCTION cestari.fn_audit_trigger('content');

DROP TRIGGER IF EXISTS trg_audit_brands ON cestari.brands;
CREATE TRIGGER trg_audit_brands
  AFTER INSERT OR UPDATE OR DELETE ON cestari.brands
  FOR EACH ROW EXECUTE FUNCTION cestari.fn_audit_trigger('brand');

DROP TRIGGER IF EXISTS trg_audit_clients ON cestari.clients;
CREATE TRIGGER trg_audit_clients
  AFTER INSERT OR UPDATE OR DELETE ON cestari.clients
  FOR EACH ROW EXECUTE FUNCTION cestari.fn_audit_trigger('client');

-- Token debit trigger: fires when audit_log records an ai_generate action
CREATE OR REPLACE FUNCTION cestari.fn_debit_tokens()
RETURNS TRIGGER AS $$
DECLARE
  v_multiplier numeric(10,2);
  v_balance integer;
  v_cost integer;
BEGIN
  IF NEW.action = 'ai_generate' AND NEW.tokens_used IS NOT NULL THEN
    SELECT token_balance, token_multiplier
    INTO v_balance, v_multiplier
    FROM cestari.organizations
    WHERE id = NEW.organization_id;

    v_cost := ceil(NEW.tokens_used * COALESCE(v_multiplier, 2.5));

    UPDATE cestari.organizations
    SET token_balance = GREATEST(0, COALESCE(v_balance, 0) - v_cost)
    WHERE id = NEW.organization_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_debit_tokens ON cestari.audit_log;
CREATE TRIGGER trg_debit_tokens
  AFTER INSERT ON cestari.audit_log
  FOR EACH ROW EXECUTE FUNCTION cestari.fn_debit_tokens();
