import React from 'react';

function StatisticaCard({ title, value, icon, trend, color = 'blue' }) {
	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-500">{title}</p>
					<p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
					{trend && (
						<div className={`flex items-center mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
							<span className="material-icons text-sm">
								{trend >= 0 ? 'arrow_upward' : 'arrow_downward'}
							</span>
							<span className="text-xs ml-1">{Math.abs(trend)}% em relação a ontem</span>
						</div>
					)}
				</div>
				<div className={`bg-${color}-100 p-3 rounded-full`}>
					<span className={`material-icons text-${color}-500`}>{icon}</span>
				</div>
			</div>
		</div>
	);
}

export default StatisticaCard;