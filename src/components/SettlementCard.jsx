const SettlementCard = ({ settlement }) => {
    return (
        <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-semibold text-lg">
                                {settlement.from.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{settlement.from}</p>
                        <p className="text-xs text-gray-500">owes</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">
                            ₹{settlement.amount.toFixed(2)}
                        </p>
                    </div>
                    <div className="text-gray-400">→</div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{settlement.to}</p>
                        <p className="text-xs text-gray-500">receives</p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-lg">
                                {settlement.to.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettlementCard;
