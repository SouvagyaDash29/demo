import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export const MultiSelectDropdown = ({
  options = [],
  selectedOptions,
  setSelectedOptions,
  keyMap = { label: "name", value: "id" }, // 👈 new prop for flexible mapping
  displayFn,                               // optional custom label
  placeholder = "Select options",
  searchPlaceholder = "Search...",
  width = "280px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧭 Helper functions
  const getLabel = (option) => {
    if (displayFn) return displayFn(option);
    if (typeof option === "object") {
      return option[keyMap.label] ?? option.name ?? option.title ?? "Unnamed";
    }
    return option;
  };

  const getValue = (option) =>
    typeof option === "object"
      ? option[keyMap.value] ?? option.id ?? getLabel(option)
      : option;

  const handleToggle = (option) => {
    const value = getValue(option);
    setSelectedOptions((prev) =>
      prev.some((o) => getValue(o) === value)
        ? prev.filter((o) => getValue(o) !== value)
        : [...prev, option]
    );
  };

  const filteredOptions = options.filter((option) =>
    getLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ position: "relative", width }} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "0.5rem",
          cursor: "pointer",
          background: "white",
        }}
      >
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {selectedOptions.length > 0
            ? `${selectedOptions.length} option(s) selected`
            : placeholder}
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "0.3rem",
            zIndex: 1000,
          }}
        >
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "none",
              borderBottom: "1px solid #eee",
              outline: "none",
            }}
          />

          <div style={{ maxHeight: "250px", overflowY: "auto", padding: "0.5rem" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const label = getLabel(option);
                const value = getValue(option);
                const isChecked = selectedOptions.some(
                  (o) => getValue(o) === value
                );
                return (
                  <label key={index} style={{ display: "block", marginBottom: "0.3rem" }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(option)}
                    />{" "}
                    {label}
                  </label>
                );
              })
            ) : (
              <div style={{ color: "#777" }}>No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
