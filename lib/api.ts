import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Pod, Challenge } from "@/types"

// Mock data - will be replaced with real API calls later
let mockPods: Pod[] = [
  {
    id: "1",
    name: "Education",
    targetAmount: 15000,
    currentAmount: 4200,
    targetDate: "2025-06-01",
    isFeatured: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Travel",
    targetAmount: 5000,
    currentAmount: 1800,
    targetDate: "2024-12-15",
    isFeatured: false,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "3",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 3200,
    targetDate: "2024-12-31",
    isFeatured: false,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
]

const mockChallenges: Challenge[] = [
  {
    id: "roundups",
    name: "Round-Ups",
    description: "Round up purchases to the nearest dollar and save the change automatically",
    subtitle: "Save spare change automatically",
    icon: "coins",
    expectedImpact: "$20-50/month",
    isActive: true,
    sinkPodId: "1",
    sinkPodName: "Emergency Fund",
    config: { minAmount: "0.50", maxAmount: "5.00" },
  },
  {
    id: "weekly-auto",
    name: "Weekly Auto-Save",
    description: "Automatically save a fixed amount every week on the same day",
    subtitle: "Consistent weekly savings",
    icon: "calendar",
    expectedImpact: "$40-200/month",
    isActive: false,
    config: { weeklyAmount: "50", dayOfWeek: "friday" },
  },
  {
    id: "52-week",
    name: "52-Week Challenge",
    description: "Save an increasing amount each week, starting from $1 and ending at $52",
    subtitle: "Progressive savings challenge",
    icon: "trophy",
    expectedImpact: "$1,378/year",
    isActive: false,
    config: { startAmount: "1.00", currentWeek: 1 },
  },
  {
    id: "cashback",
    name: "Cashback Hunt",
    description: "Automatically save cashback rewards and found deals into your pods",
    subtitle: "Optimize your spending rewards",
    icon: "credit-card",
    expectedImpact: "$15-75/month",
    isActive: false,
    config: { threshold: "1.00", autoApply: false },
  },
]

// API functions (stubbed for now)
export const usePods = () => {
  return useQuery({
    queryKey: ["pods"],
    queryFn: async (): Promise<Pod[]> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockPods
    },
  })
}

export const usePod = (id: string) => {
  return useQuery({
    queryKey: ["pod", id],
    queryFn: async (): Promise<Pod | null> => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockPods.find((pod) => pod.id === id) || null
    },
  })
}

export const useChallenges = () => {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: async (): Promise<Challenge[]> => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockChallenges
    },
  })
}

export const useCreatePod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (pod: Omit<Pod, "id" | "createdAt" | "updatedAt">): Promise<Pod> => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newPod: Pod = {
        ...pod,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      // Add the new pod to the mock data
      mockPods.push(newPod)
      return newPod
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pods"] })
    },
  })
}

export const useToggleChallenge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      challengeId,
      isActive,
      sinkPodId,
    }: {
      challengeId: string
      isActive: boolean
      sinkPodId?: string
    }): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      // Mock toggle logic - would update challenge state
      console.log(`Toggle challenge ${challengeId} to ${isActive ? "active" : "inactive"}`, { sinkPodId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] })
      queryClient.invalidateQueries({ queryKey: ["pods"] })
    },
  })
}

export const useConfigureChallenge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      challengeId,
      config,
    }: {
      challengeId: string
      config: Record<string, any>
    }): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      // Mock configuration logic
      console.log(`Configure challenge ${challengeId}`, config)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] })
    },
  })
}

export const useUpdatePod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      podId,
      updates,
    }: {
      podId: string
      updates: Partial<Omit<Pod, "id" | "createdAt" | "updatedAt">>
    }): Promise<Pod> => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const podIndex = mockPods.findIndex((pod) => pod.id === podId)
      if (podIndex === -1) throw new Error("Pod not found")
      
      const updatedPod = {
        ...mockPods[podIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      mockPods[podIndex] = updatedPod
      return updatedPod
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pods"] })
    },
  })
}

export const useDeletePod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (podId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const podIndex = mockPods.findIndex((pod) => pod.id === podId)
      if (podIndex === -1) throw new Error("Pod not found")
      mockPods.splice(podIndex, 1)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pods"] })
    },
  })
}

export const useExportPod = () => {
  return useMutation({
    mutationFn: async (podId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      // Mock export logic - would generate CSV
      console.log(`Exporting pod ${podId} data`)
    },
  })
}
