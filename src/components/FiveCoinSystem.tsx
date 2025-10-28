import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGoalProgress } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
// ... (outros imports)

export const FiveCoinSystem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ... (outras queries e estados)

  const goalMutation = useMutation({
    mutationFn: ({ goalId, amount }: { goalId: string; amount: number }) => 
      updateGoalProgress(goalId, amount),
    onSuccess: (completedGoal) => {
      // A interface agora é responsável pela notificação
      if (completedGoal) {
        toast({
          title: "Meta Concluída! 🎉",
          description: `Você ganhou +${completedGoal.reward} moedas por: ${completedGoal.name}`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['dailyGoals', 'coins'] });
    },
  });

  // ... (JSX do componente)
};
