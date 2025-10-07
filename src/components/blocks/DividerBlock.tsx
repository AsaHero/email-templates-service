/**
 * Divider Block Component
 *
 * Horizontal separator line.
 */

import { Hr } from "@react-email/components";
import { DividerBlock as DividerBlockType } from "../../types/email.types";

interface DividerBlockProps extends Omit<DividerBlockType, "type"> {
  className?: string;
}

export const DividerBlock = ({
  color = "#e0e0e0",
  thickness = 1,
  className = "",
}: DividerBlockProps) => {
  return (
    <Hr
      className={className}
      style={{
        borderColor: color,
        borderWidth: `${thickness}px`,
        borderStyle: "solid",
        margin: "24px 0",
      }}
    />
  );
};
