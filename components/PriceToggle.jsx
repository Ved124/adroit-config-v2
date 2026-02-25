import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { ConfigContext } from "../src/ConfigContext";

export default function PriceToggle() {
  const { showPrices, setShowPrices } = useContext(ConfigContext);

  return (
    <button
      onClick={() => setShowPrices(!showPrices)}
      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      <FontAwesomeIcon icon={showPrices ? faEyeSlash : faEye} />
      {showPrices ? "" : ""}
    </button>
  );
}
