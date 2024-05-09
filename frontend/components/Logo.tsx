import Image from "next/image";
import ocsLogo from "@/app/assets/logos/ocs-logo.svg";

export default function Logo({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image src={ocsLogo} alt="OctaSwap Logo" width={width} height={height} />
  );
}
