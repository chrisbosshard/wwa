type Props = {
  title: string;
  date: string;
  value: number;
  max: number;
};

export const MainCutoutProgress = ({ title, date, value, max }: Props) => {
  const percentage = Math.min(Math.floor((value / max) * 100), 100);
  const displayValue = Math.min(value, max);

  return (
    <div className="main-cutout-progress">
      <div className="main-cutout-progress-header">
        <p className="main-cutout-progress-title">{title}</p>
        <p className="main-cutout-progress-date">{date}</p>
      </div>
      <div className="main-cutout-progress-shell">
        <div className="main-cutout-progress-track">
          <div className="main-cutout-progress-fill" style={{ width: `${Math.max(percentage, displayValue > 0 ? 8 : 0)}%` }}>
            {displayValue}
          </div>
        </div>
      </div>
    </div>
  );
};
