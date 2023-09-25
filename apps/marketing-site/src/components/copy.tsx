import parse from "html-react-parser";
import { Maybe } from "../../types/gql";

interface CopyComponentProps {
  copy?: Maybe<string> | string;
}

export const CopyComponent = ({ copy }: CopyComponentProps) => (
  <div className="skylark-wysiwyg">{parse(copy || "")}</div>
);
