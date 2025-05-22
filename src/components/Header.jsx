import { Link } from 'react-router-dom';

const Header = ({ searchTerm, setSearchTerm }) => {



	return (
		<header className="header">
			<div className="container">
				<div className="header__content d-flex justify-content-center align-items-center">
					<div className="header__box">
						<Link to='/'>
							<img className="header__logo" src="https://www.blissburger.com.br/img/logotipo.png" alt="logo" />
						</Link>
					</div>
					<div className="header__search d-flex align-items-center">
						<input
							type="text"
							placeholder="Buscar produtos..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex-grow-1 mr-2"
						/>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;