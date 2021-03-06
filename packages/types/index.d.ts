/* eslint-disable @typescript-eslint/ban-types */
export interface Status {
	cores: number,
	cpuUsage: number,
	ramUsage: number,
	activeRam: number,
	totalRam: number,
	gpuUsage: number,
	vramUsage: number,
	vms: {
		name: string,
		id: string,
		state: string,
		cpuUsage: number,
		processorCount: number,
		uptime: string,
		ram: number,
		ramUsage: number,
		activeRam: number,
		totalRam: number,
	}[],
}

type VMIdentification = {
	vmName: string,
}

interface ActionsMap {
	updateAgent: {
		zipUrl: string,
		zipPath: string,
	},
	wakeHost: {},
	shutdownHost: {},
	suspendHost: {},
	restartHost: {},
	restartHostParsec: {},
	switchHostDisplay: {
		mode: 'internal' | 'external' | 'clone',
	},
	startVM: VMIdentification,
	stopVM: VMIdentification,
	setVMCPU: VMIdentification & {
		value: number,
	},
	setVMRAM: VMIdentification & {
		value: number,
	},
}

export type ActionName = keyof ActionsMap

export type AgentActionName = Exclude<ActionName, 'wakeHost'>

export type RawActionBody<A extends ActionName> = {
	action: A,
} & ActionsMap[A]

export type ActionBody<A extends ActionName> = {
	uuid: string,
} & RawActionBody<A>

export type UnknownRawActionBody = {[k in ActionName]: RawActionBody<k>}[ActionName]

export type UnknownActionBody = {[k in ActionName]: ActionBody<k>}[ActionName]

export type AgentUnknownActionBody = {[k in AgentActionName]: ActionBody<k>}[AgentActionName]

export type AgentActionHandlerMap = {
	[k in AgentActionName]: (actionBody: ActionBody<k>) => Promise<void | string>
}

export interface CheckinRequestBody {
	status: Status,
	completedIds: string[],
	errors: string[],
}
