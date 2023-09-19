import { SkylarkLogo } from "./skylarkBranding";

export const Footer = () => (
  <div className="gutter relative h-96 w-full bg-skylark-black pt-20">
    <div className="grid  w-full grid-cols-2 ">
      <div>
        <SkylarkLogo />
      </div>
      <div className="flex w-full justify-end">
        <div className="w-64 text-sm font-normal">
          <h6 className="mb-8 font-bold">{`Get in touch`}</h6>
          <a
            className="text-skylark-orange hover:text-skylark-blue"
            href={"mailto:hello@skylarkplatform.com?subject=Hello"}
            rel="noreferrer"
            target="_blank"
          >
            {"hello@skylarkplatform.com"}
          </a>
        </div>
      </div>
    </div>
    <p className="absolute bottom-10 left-0 right-0 text-center text-xs text-gray-500">{`Copyright © 2023 Skylark. All rights reserved.`}</p>
  </div>
);
