import type { JSX } from "react";

import type Work from "../../models/work";

type WorkInfoContentsProps = Pick<Work, "contents">;

export default function WorkInfoContents({
  contents,
}: WorkInfoContentsProps): JSX.Element {
  return (
    <>
      {contents.map((content, index) => (
        <p key={index} className="work-info__content">
          {content}
        </p>
      ))}
    </>
  );
}
