import Link from "next/link";
import React from "react";
import { MdPlayArrow } from "react-icons/md";
import { List } from "../../list";
import { H4 } from "../../typography";

export type ThumbnailContentLocation = "inside" | "below";

export interface BaseThumbnailProps {
  backgroundImage: string;
  contentLocation?: ThumbnailContentLocation;
  large?: boolean;
}

export interface BaseThumbnailWithLinkProps extends BaseThumbnailProps {
  href: string;
}
export interface ThumbnailProps extends BaseThumbnailWithLinkProps {
  title: string;
  subtitle?: string;
  playButton?: boolean;
  callToAction?: {
    text: string;
    display?: "always" | "hover";
  };
  tags?: string[];
  releaseDate?: string;
  duration?: string;
}

const BaseThumbnail: React.FC<BaseThumbnailProps> = ({
  backgroundImage,
  contentLocation = "inside",
  children,
  large,
}) => (
  <div
    // scale-[1.0001] stops a rough animation on a scale transition
    className={`
        ${
          large
            ? "aspect-3/4 hover:scale-[1.01] md:hover:scale-[1.03]"
            : "aspect-video hover:scale-[1.02] md:hover:scale-105"
        }
        z-30 block w-full scale-[1.0001] rounded-sm bg-cover bg-clip-border bg-center
        bg-no-repeat transition-all hover:z-40
      `}
    style={{ backgroundImage: `url('${backgroundImage}')` }}
  >
    <div
      className={`
          ${contentLocation === "below" ? "justify-end" : "justify-between"}
          relative flex h-full w-full flex-col rounded-sm
          bg-gradient-to-t from-gray-900 to-transparent bg-clip-border bg-no-repeat p-4 font-display
          text-white shadow shadow-gray-900 transition-all hover:scale-[1.005] group-hover:bg-purple-500/[.85]
        `}
    >
      {children}
    </div>
  </div>
);

export const BaseThumbnailWithLink: React.FC<BaseThumbnailWithLinkProps> = (
  props
) => (
  <Link href={props.href}>
    <a className="group">
      <BaseThumbnail {...props} />
    </a>
  </Link>
);

export const MediaThumbnail: React.FC<ThumbnailProps> = (props) => {
  const {
    contentLocation,
    duration,
    callToAction,
    title,
    subtitle,
    tags,
    href,
    children,
  } = props;
  return (
    <Link href={href}>
      <a className="group">
        <BaseThumbnail {...props}>
          {duration && (
            <div className="absolute top-3 right-3 rounded-xl bg-gray-900 py-0.5 px-2 text-xs font-light group-hover:opacity-0">
              {duration}
            </div>
          )}
          <div className="flex flex-row items-center gap-2 font-light lg:gap-4">
            <div className="inline-block w-auto rounded-full bg-gray-600/[.65] p-2 group-hover:bg-black/[.3]">
              <MdPlayArrow className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            {callToAction && (
              <p
                className={`font-medium transition-opacity ${
                  callToAction?.display === "always"
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {callToAction.text}
              </p>
            )}
          </div>
          {contentLocation === "inside" && (
            <div>
              <H4 className="mb-0.5 font-normal text-white">{title}</H4>
              <List
                contents={[subtitle, ...(tags && tags.length > 0 ? tags : [])]}
                highlightFirst
              />
            </div>
          )}
        </BaseThumbnail>
        {contentLocation === "below" && children}
      </a>
    </Link>
  );
};
