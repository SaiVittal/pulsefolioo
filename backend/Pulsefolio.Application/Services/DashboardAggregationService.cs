using System;
using System.Threading.Tasks;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.Models.Dashboard;

namespace Pulsefolio.Application.Services
{
    public class DashboardAggregationService : IDashboardAggregationService
    {
        private readonly IDashboardService _dashboardService;
        private readonly IHoldingService _holdingService;
        private readonly IValuationQueryService _valuationQuery;
        private readonly IAnalyticsService _analyticsService;
        private readonly ITransactionService _transactionService;
        private readonly IPortfolioAnalyticsService _portfolioAnalytics;

        public DashboardAggregationService(
            IDashboardService dashboardService,
            IHoldingService holdingService,
            IValuationQueryService valuationQuery,
            IAnalyticsService analyticsService,
            ITransactionService transactionService,
            IPortfolioAnalyticsService portfolioAnalytics)
        {
            _dashboardService = dashboardService;
            _holdingService = holdingService;
            _valuationQuery = valuationQuery;
            _analyticsService = analyticsService;
            _transactionService = transactionService;
            _portfolioAnalytics = portfolioAnalytics;
        }

        public async Task<DashboardFullResponse> GetFullDashboardAsync(Guid portfolioId, Guid userId)
        {
            // Run calls in parallel
            var summaryTask = _dashboardService.GetDashboardAsync(portfolioId);

            var holdingsTask =
                _holdingService.GetHoldingsAsync(portfolioId, userId);

            var valuationHistoryTask =
                _valuationQuery.GetHistoryAsync(portfolioId, null, null);

            var top10Task =
                _analyticsService.GetTop10Async();

            var transactionsTask =
                _transactionService.GetPortfolioTransactionsAsync(portfolioId, userId);

            var pnlTask =
                _portfolioAnalytics.ComputePortfolioPnlAsync(portfolioId);

            await Task.WhenAll(
                summaryTask,
                holdingsTask,
                valuationHistoryTask,
                top10Task,
                transactionsTask,
                pnlTask
            );

            return new DashboardFullResponse
            {
                Summary          = summaryTask.Result,
                Holdings         = holdingsTask.Result,
                ValuationHistory = valuationHistoryTask.Result,
                Top10            = top10Task.Result,
                Transactions     = transactionsTask.Result,
                Pnl              = pnlTask.Result
            };
        }
    }
}
