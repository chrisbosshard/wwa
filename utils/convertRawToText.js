/****************************************************************
 * CONVERT RAW TO TEXT
 * Convert Raw Text from a WYSIWYG into React Components
 ****************************************************************/

import React from "react";

export const convertRawToText = (text) => {
  let counter = 0;

  const lines = text.children.map((item) => {
    counter++;

    // In case of a textline
    if (item.type === "paragraph") {
      const content = item.children[0] ? item.children[0] : "none";
      const paragraph = content.bold ? <b>{content.text}</b> : content.text;
      if (content.underlined) {
        return <h2 key={"line-" + counter}>{paragraph}</h2>;
      } else if (content.italic) {
        return (
          <p key={"line-" + counter} style={{ margin: "0px" }}>
            {paragraph}
          </p>
        );
      } else {
        return <p key={"line-" + counter}>{paragraph}</p>;
      }
    }

    // // In case of underlined text
    // if (item.type === "paragraph") {
    //   const content = item.children[0] ? item.children[0] : "none";
    //   const paragraph = content.bold ? <b>{content.text}</b> : content.text;
    //   return <h4 key={"line-" + counter}>{paragraph}</h4>;
    // }

    // // In case of underlined text
    // if (item.type === "paragraph") {
    //   const mark = item.nodes[0].leaves[0].marks[0] ? item.nodes[0].leaves[0].marks[0].type : "none";
    //   const paragraph = mark === "italic" ? <b>{item.nodes[0].leaves[0].text}</b> : item.nodes[0].leaves[0].text;
    //   return <h4 key={"line-" + counter}>{paragraph}</h4>;
    // }

    // In case of an image
    if (item.type === "image") {
      return (
        <img key={"line-" + counter} className={"inline_picture"} src={item.src} alt="Inline" />
      );
    }

    // In case of a bulleted list
    if (item.type === "bulleted-list") {
      let subcounter = 0;
      const bulletList = item.children.map((bullet) => {
        subcounter++;
        return (
          <li key={"line-" + counter + "-" + subcounter}>
            <p>{bullet.children[0].children[0].text}</p>
          </li>
        );
      });
      return (
        <ul className={"list"} key={"line-" + counter}>
          {bulletList}
        </ul>
      );
    }

    // In case of a numbered list
    if (item.type === "numbered-list") {
      let subcounter = 0;
      const bulletList = item.children.map((bullet) => {
        subcounter++;
        return (
          <li key={"line-" + counter + "-" + subcounter}>{bullet.children[0].children[0].text}</li>
        );
      });
      return (
        <ol className={"list"} key={"line-" + counter}>
          <p>{bulletList}</p>
        </ol>
      );
    }
    return null;
  });
  return lines;
};

export default convertRawToText;
