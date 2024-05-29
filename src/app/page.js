'use client'
import { useState } from 'react'
import { Importer, ImporterField } from 'react-csv-importer'
import { ethers, Contract } from 'ethers'
import multisendJson from './multisend.json'

const blockchainExplorerUrls = { 84532: 'https://sepolia.basescan.org/tx' }

export default function Home() {
	const [payments, setPayments] = useState(undefined)
	const [sending, setSending] = useState(false)
	const [error, setError] = useState(false)
	const [transaction, setTransaction] = useState(false)
	const [blockchainExplorer, setBlockchainExplorer] = useState(undefined)

	const sendPayments = async () => {
		const provider = new ethers.BrowserProvider(window.ethereum)
		const signer = await provider.getSigner()
		const { chainId } = await provider.getNetwork()
		setBlockchainExplorer(blockchainExplorerUrls[chainId.toString()])

		//Showing feedback
		setSending(true)

		//Format arguments for sm function
		const { recipients, amounts, total } = payments.reduce(
			(acc, val) => {
				acc.recipients.push(val.recipient)
				acc.amounts.push(val.amount)
				acc.total += parseInt(val.amount)
				return acc
			},
			{ recipients: [], amounts: [], total: 0 }
		)

		//Send tx
		const multisend = new Contract(
			multisendJson.address,
			multisendJson.abi,
			signer
		)

		try {
			const tx = await multisend.send(recipients, amounts, { value: total })
			const txReceipt = await tx.wait()
			setTransaction(txReceipt.hash)
		} catch (e) {
			console.log(e)
			setError(true)
		}
	}
	return (
		<div className='container-fluid mt-5 d-flex justify-content-center'>
			<div id='content' className='row'>
				<div id='content-inner' className='col'>
					<div className='text-center'>
						<h1 id='title' className='fw-bold'>
							MULTISEND
						</h1>
						<p id='sub-title' className='mt-4 fw-bold'>
							<span>
								Send many payments <br />
								in one transaction
							</span>
						</p>
					</div>
					<Importer
						dataHandler={rows => setPayments(rows)}
						defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
						restartable={false} // optional, lets user choose to upload another file when import is complete
					>
						<ImporterField name='recipient' label='recipient' />
						<ImporterField name='amount' label='amount' />
						<ImporterField name='currency' label='currency' />
					</Importer>
					<div className='text-center'>
						<button
							className='btn btn-primary mt-5'
							onClick={sendPayments}
							disabled={sending || typeof payments === 'undefined'}
						>
							Send payments
						</button>
					</div>
					{sending && (
						<div className='alert alert-info mt-4 mb-0'>
							Your payments are processing.Please wait ...
						</div>
					)}
					{transaction && (
						<div className='alert alert-success mt-4 mb-0'>
							Done{' '}
							<a
								href={`${blockchainExplorer}/${transaction}`}
								target='_blank'
							>{`${transaction.substr(0, 20)}...`}</a>
						</div>
					)}
					{error && (
						<div className='alert alert-danger mt-4 mb-0'>
							We have a problem.Try later.
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
