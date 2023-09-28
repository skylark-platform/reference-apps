import * as AvatarPrimitive from "@radix-ui/react-avatar";
import clsx from "clsx";
import { Person, Maybe, SkylarkImage } from "../../types/gql";

const getIntialsFromName = (str: string) => {
  const initials = str
    .split(" ")
    .map((name) => (name && name.length > 0 ? name[0] : null))
    .filter((name): name is string => !!name);
  return initials.join("");
};

const Avatar = ({
  src,
  alt,
  initials,
}: {
  src: string;
  alt: string;
  initials: string;
}) => (
  <AvatarPrimitive.Root className="relative inline-flex h-10 w-10 md:h-14 md:w-14">
    <AvatarPrimitive.Image
      alt={alt}
      className={clsx("h-full w-full rounded object-cover")}
      src={src}
    />
    <AvatarPrimitive.Fallback
      className={clsx(
        "flex h-full w-full items-center justify-center rounded bg-white dark:bg-gray-800",
      )}
      delayMs={600}
    >
      <span className="text-sm font-medium uppercase text-gray-700 dark:text-gray-400 md:text-base">
        {initials}
      </span>
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
);

const PersonAvatar = ({ person }: { person: Person }) => {
  const initials = person.name ? getIntialsFromName(person.name) : "";
  const image =
    person.images?.objects && person.images.objects.length > 0
      ? person.images.objects.find((img): img is SkylarkImage => !!img?.url)
      : null;

  return (
    <Avatar
      alt={image?.title || "avatar"}
      initials={initials}
      src={image?.url || ""}
    />
  );
};

export const PersonCard = ({ person }: { person: Maybe<Person> }) =>
  person ? (
    <div className="my-6 flex items-center space-x-2">
      <PersonAvatar person={person} />
      <div>
        <p className="text-xl font-bold">{person.name}</p>
        {person.role && <p className="text-sm">{person.role}</p>}
      </div>
    </div>
  ) : (
    <></>
  );
