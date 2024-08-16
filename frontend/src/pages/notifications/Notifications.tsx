import Heading from "@/components/Heading";
import NotificationItem from "@/components/NotificationItem";
import Spinner from "@/components/Spinner";
import { PageProvider } from "@/context/PageProvider";
import { useGetInfiniteScrollProduct } from "@/utils/QueryFunctions";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Notifications = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteScrollProduct({
    entity: "notifications",
  });
  const { ref, inView } = useInView();
  useEffect(
    function () {
      if (inView && hasNextPage) fetchNextPage();
    },
    [inView, hasNextPage, fetchNextPage]
  );
  const notifications = data?.pages.flatMap((page) => page.data?.docs);
  console.log(notifications, data);
  return (
    <div className="bg-white min-h-screen py-2 overflow-hidden relative">
      <div className=" flex items-start justify-between mt-4 px-8">
        <Heading text="Notifications" />
      </div>
      <div>
        {isLoading ? (
          <div className=" min-h-10" ref={ref}>
            {isFetchingNextPage || isLoading ? <Spinner /> : null}
          </div>
        ) : (
          <div className=" flex   max-w-lg flex-col items-start">
            {notifications?.map((item: any) => (
              <NotificationItem item={item} key={item._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const NotificationsPage = () => {
  return (
    <PageProvider>
      <Notifications />
    </PageProvider>
  );
};
export default NotificationsPage;
