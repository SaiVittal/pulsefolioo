import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBuyTransaction,
  createSellTransaction,
  CreateTransactionDto,
} from "../api/transactionApi";

export function useBuyTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransactionDto) =>
      createBuyTransaction(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["holdings", vars.portfolioId] });
      qc.invalidateQueries({ queryKey: ["transactions", vars.portfolioId] });
    },
  });
}

export function useSellTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransactionDto) =>
      createSellTransaction(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["holdings", vars.portfolioId] });
      qc.invalidateQueries({ queryKey: ["transactions", vars.portfolioId] });
    },
  });
}
