import "./FilterBar.css";

export interface FilterGroup {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

interface FilterBarProps {
  groups: FilterGroup[];
}

const FilterBar = ({ groups }: FilterBarProps) => {
  return (
    <div className="filter-bar">
      {groups.map((group) => (
        <div className="filter-group" key={group.label}>
          <span className="filter-group-label">{group.label}</span>
          <div className="filter-chips">
            <button
              type="button"
              className={`filter-chip ${group.selected === null ? "is-active" : ""}`}
              onClick={() => group.onSelect(null)}
            >
              All
            </button>
            {group.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`filter-chip ${group.selected === option ? "is-active" : ""}`}
                onClick={() => group.onSelect(group.selected === option ? null : option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
