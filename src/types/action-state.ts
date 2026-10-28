export interface ActionState {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Record<string, string[]>;
}

export const IDLE_ACTION_STATE: ActionState = { status: "idle" };

export interface SimpleActionResult {
  ok: boolean;
  message?: string;
}
