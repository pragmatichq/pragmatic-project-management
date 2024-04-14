import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Doc } from "@/convex/_generated/dataModel";

function TaskCard({ action }: { action: any }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: action._id,
    data: {
      type: "Action",
      action,
    },
    disabled: false,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="p-2.5 h-[100px] min-h-[100px] rounded-xl border border-dashed"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl cursor-grab relative bg-white border"
    >
      <p className="select-none	my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {action.title}
      </p>
    </div>
  );
}

export default TaskCard;
