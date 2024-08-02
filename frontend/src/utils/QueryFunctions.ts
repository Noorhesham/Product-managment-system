import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import usePrefetchPages from "@/hooks/usePrefetchPages";
import { typeProps } from "@/types";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
export const useGetProduct = (id: string, page: number) => {
  const axios = useAxiosPrivate();
  const { data, isLoading } = useQuery({
    queryFn: async () => await axios.get(`/products/${id}/details?page=${page}&limit=10`),
    queryKey: [`product${id}${page}`],
  });

  return { data, isLoading };
};
export const useGetEntityById = (entityType: typeProps, id: string) => {
  const axios = useAxiosPrivate();

  const { data, isLoading, error } = useQuery({
    queryFn: async () => await axios.get(`/${entityType}/${id}`),
    queryKey: [`${entityType}${id}`],
  });
  return { data, isLoading, error };
};

export const useGetEntity = (entityType: typeProps, page: number, limit = 10) => {
  const axios = useAxiosPrivate();

  const { data, isLoading, error } = useQuery({
    queryFn: async () => await axios.get(`/${entityType}?page=${page}&limit=${limit}`),
    queryKey: [`${entityType}${page}`],
  });

  usePrefetchPages({ data, page, baseUrl: entityType, limit, key: entityType });

  return { data, isLoading, error };
};

export const useDeleteEntity = (entityType: typeProps, _entityId?: string, page: number = 1) => {
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();

  const { mutate: deleteEntity, isPending } = useMutation({
    mutationFn: async (entityId?: string) => await axios.delete(`/${entityType}/${entityId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${entityType}${page || 1}`] });
      toast.success(`${entityType} deleted `);
    },
  });
  return { deleteEntity, isPending };
};
export const useUploadEntity = (entityType: string, page: number = 1, id: string = "") => {
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();

  const {
    mutate: uploadEntity,
    isPending,
    error,
  } = useMutation({
    mutationFn: id
      ? async (data: any) => (await axios.patch(`/${entityType}/${id}`, data)).data
      : async (data: any) => (await axios.post(`/${entityType}`, data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${entityType}${page}`] });
      toast.success(`${entityType} uploaded successfully`);
    },
    onError: (err) => {
      console.log(err);
      //@ts-ignore
      toast.error(`Error uploading ${entityType}: ${err.response.data.message}`);
    },
  });

  return { uploadEntity, isPending, error };
};

export const useGetInfiniteScrollProduct = () => {
  const axios = useAxiosPrivate();

  const {
    data: data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      const { data } = await axios.get(`/products?page=${pageParam}&limit=10`);
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.totalPages >= nextPage ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
  return { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage };
};
//without the custome hook
// useEffect(() => {
//   if (data && data.data.totalPages > page) {
//     queryClient.prefetchQuery({
//       queryKey: [`products ${page + 1}`],
//       queryFn: async () => await axios.get(`/products?page=${page}&limit=10`),
//     });

//     if (data.data.totalPages > page + 1) {
//       queryClient.prefetchQuery({
//         queryKey: [`products ${page + 2}`],
//         queryFn: async () => await axios.get(`/products?page=${page}&limit=10`),
//       });
//     }
//   }
// }, [data, page, queryClient]);
