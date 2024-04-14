import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import { Doc } from "@/convex/_generated/dataModel";

function ColumnContainer({ actions, column }: { actions: any; column: any }) {
  const { setNodeRef, transform, transition } = useSortable({
    id: column?.value!,
    data: {
      type: "Column",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  let actionIds;

  if (actions) {
    actionIds = actions.map((action: Doc<"actions">) => action._id);
  }

  return (
    <div className="w-[350px]">
      {actions ? (
        <>
          <h2 className="text-lg font-bold mb-2">{column?.value}</h2>
          <div
            ref={setNodeRef}
            className="flex flex-col gap-2 overflow-hidden min-h-[116px]"
          >
            <SortableContext items={actionIds}>
              {actions.map((action: Doc<"actions">) => (
                <TaskCard key={action._id} action={action} />
              ))}
            </SortableContext>
          </div>
        </>
      ) : (
        <div>Hello</div>
      )}
    </div>
  );
}

export default ColumnContainer;
