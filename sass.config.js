// sass.config.js (versão ESM)
import sass from 'sass';

export default {
	// Força o uso da nova API
	implementation: sass,
	// Desativa avisos sobre a API legada
	sassOptions: {
		quietDeps: true
	}
};