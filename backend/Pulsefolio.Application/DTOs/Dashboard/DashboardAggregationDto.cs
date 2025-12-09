using System.Collections.Generic;
using Pulsefolio.Application.DTOs.Dashboard;
using Pulsefolio.Application.DTOs.Holding;
using Pulsefolio.Application.DTOs.Valuation;
using Pulsefolio.Application.DTOs.Analytics;
using Pulsefolio.Application.DTOs.Transaction;
using Pulsefolio.Application.DTOs.Portfolio;
using Pulsefolio.Application.DTOs;

namespace Pulsefolio.Application.Models.Dashboard
{
    public class DashboardFullResponse
    {
        public DashboardDto Summary { get; set; } = default!;
        public PortfolioPnlDto Pnl { get; set; } = default!;

        public IReadOnlyList<HoldingDto> Holdings { get; set; } = new List<HoldingDto>();
        
        public IReadOnlyList<ValuationSnapshotDto> ValuationHistory { get; set; }
            = new List<ValuationSnapshotDto>();
        
        public IReadOnlyList<TopPortfolioPnlDto> Top10 { get; set; }
            = new List<TopPortfolioPnlDto>();
        
        public IReadOnlyList<TransactionDto> Transactions { get; set; }
            = new List<TransactionDto>();
    }
}
