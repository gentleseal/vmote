import type {ActionBody, ActionName, RawActionBody} from 'types'

import 'sweetalert2/dist/sweetalert2.css'
import Swal from 'sweetalert2'

export async function showError(text: string) {
	await Swal.fire({
		text,
		icon: 'error',
	})
}

export async function sendCommand<A extends ActionName>(action: RawActionBody<A>): Promise<void> {
	await Swal.fire({
		title: 'Applying changes ⌛',
		didOpen: () => {
			Swal.showLoading()
			fetch('/execute', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(action),
			})
				.then((response) => {
					if (response.status !== 200) {
						response.text().then((text) => { showError(text) })
					}
				})
				.catch(() => { })
				.finally(() => { Swal.close() })
		},
	})
}

async function setVM(vmName: string, current: number, inputAttributes: Record<string, string | number>, propName: 'CPU' | 'RAM', text: string) {
	await Swal.fire({
		title: `Select the amount of ${propName} to assign`,
		text,
		icon: 'question',
		input: 'range',
		inputAttributes: inputAttributes as Record<string, string>,
		inputValue: current,
		showLoaderOnConfirm: true,
		preConfirm: (value) => sendCommand({
			action: `setVM${propName}`,
			vmName,
			value,
		}),
	})
}

export function setVMCPU(vmName: string, current: number, max: number): Promise<void> {
	return setVM(
		vmName,
		current,
		{
			min: 1,
			max,
			step: 1,
		},
		'CPU',
		'Logical Cores',
	)
}

export function setVMRAM(vmName: string, current: number, max: number): Promise<void> {
	return setVM(
		vmName,
		current,
		{
			min: 0.1,
			max,
			step: 0.1,
		},
		'RAM',
		'GB',
	)
}
