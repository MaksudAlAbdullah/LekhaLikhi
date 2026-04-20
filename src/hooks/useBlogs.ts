"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { blogsApi } from "@/lib/api/blogs.api"

export const blogKeys = {
  all: ["blogs"] as const,
  dashboard: () => [...blogKeys.all, "dashboard"] as const,
}

export const useBlogs = ({ enabled = true }: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: blogKeys.dashboard(),
    queryFn: blogsApi.getAll,
    enabled,
  })

export const useCreateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: blogsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: blogKeys.all,
      })
    },
  })
}

export const useUploadBlogImage = () =>
  useMutation({
    mutationFn: blogsApi.uploadImage,
  })