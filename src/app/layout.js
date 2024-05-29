import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-csv-importer/dist/index.css'
import './styles.css'

export const metadata = {
	title: 'Multi send',
	description: 'Send many payments in one transaction',
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	)
}
