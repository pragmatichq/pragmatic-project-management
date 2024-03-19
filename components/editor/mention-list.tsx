import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  ForwardRefRenderFunction,
} from "react";
import { useOrganization } from "@clerk/nextjs";

interface MentionListProps {
  query: string;
  command: ({ id }: { id: string }) => void;
}

interface MentionListRef {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
}

const Mentions: ForwardRefRenderFunction<MentionListRef, MentionListProps> = (
  props,
  ref
) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { memberships, isLoaded } = useOrganization({ memberships: true });
  let membershipItems: string[] = [];

  if (isLoaded) {
    membershipItems =
      memberships?.data?.map(
        (member) =>
          `${member.publicUserData.firstName} ${member.publicUserData.lastName}`
      ) || [];
  }

  const items = membershipItems
    .filter((item) => item.toLowerCase().startsWith(props.query.toLowerCase()))
    .slice(0, 5);

  const selectItem = (index: number): void => {
    const item = items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = (): void => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  };

  const downHandler = (): void => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const enterHandler = (): void => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.query]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="items">
      {items.length ? (
        items.map((item, index) => (
          <button
            className={`item ${index === selectedIndex ? "is-selected" : ""}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
};

export const MentionList = forwardRef(Mentions);
