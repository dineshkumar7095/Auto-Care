/** Generic state-machine guard used for orders, job cards and towing trips. */
export function canTransition<S extends string>(map: Record<S, readonly S[]>, from: S, to: S): boolean {
  return map[from]?.includes(to) ?? false;
}

export function nextStates<S extends string>(map: Record<S, readonly S[]>, from: S): readonly S[] {
  return map[from] ?? [];
}

export class TransitionError extends Error {
  constructor(public readonly from: string, public readonly to: string) {
    super(`Cannot move from "${from}" to "${to}"`);
    this.name = "TransitionError";
  }
}

export function assertTransition<S extends string>(map: Record<S, readonly S[]>, from: S, to: S): void {
  if (!canTransition(map, from, to)) throw new TransitionError(from, to);
}
