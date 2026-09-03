import { LinkedinLogo } from "@phosphor-icons/react";
import type { Icon as AppIcon, IconProps } from "iconsax-react";

/** Iconsax (used for every other icon on the site) has no LinkedIn glyph —
 * this bridges Phosphor's filled logo behind the same {variant,size,...}
 * shape so it drops straight into the same social-icon maps as Instagram
 * and Dribbble. */
export const LinkedinIcon: AppIcon = ({ variant, ...rest }: IconProps) => (
  <LinkedinLogo weight={variant === "Bold" ? "fill" : "regular"} {...rest} />
);
