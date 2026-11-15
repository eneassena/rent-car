const ItemContentDashboard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-card border border-slate-100">
            {children}
        </div>
    );
};

export default ItemContentDashboard;