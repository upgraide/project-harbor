"use server";

import { getStatus } from "@openstatus/react";

export async function fetchStatus() {
	const res = await getStatus("midday"); // TODO: Change to Harbor

	const { status } = res;

	return status;
}
