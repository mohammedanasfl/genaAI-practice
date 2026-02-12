const SummaryPanel = ({ summary, insights }) => {
    if (!summary) return null;

    return (
        <div className="summary-panel">
            <h3>DOCUMENT SUMMARY</h3>
            <p className="summary-text">{summary}</p>

            {insights && insights.length > 0 && (
                <>
                    <h3>INSIGHTS</h3>
                    <ul className="insights-list">
                        {insights.map((insight, idx) => (
                            <li key={idx}>{insight}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SummaryPanel;
