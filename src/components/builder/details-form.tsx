"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { detailsSchema, dateDays, type BuilderDetails } from "@/lib/builder";
import { Button } from "@/components/ui/button";
import styles from "./builder.module.css";

export function DetailsForm({
  value,
  assigned,
  onApply,
}: {
  value: BuilderDetails;
  assigned: number;
  onApply: (details: BuilderDetails) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<BuilderDetails>({
    resolver: zodResolver(detailsSchema),
    defaultValues: value,
  });
  const mode = useWatch({ control, name: "dateMode" });
  const level = useWatch({ control, name: "budgetLevel" });
  const apply = handleSubmit((d) => {
    const days =
      d.dateMode === "dates" ? dateDays(d.startDate, d.endDate) : d.totalDays;
    if (days < assigned) {
      setError("totalDays", {
        message: `Your route already uses ${assigned} days. Reduce city days or remove a stop first.`,
      });
      return;
    }
    onApply({ ...d, totalDays: days });
  });
  return (
    <form onSubmit={apply} className={styles.form} noValidate>
      <label>
        Trip name
        <input {...register("name")} maxLength={80} />
      </label>
      <fieldset>
        <legend>When are we going?</legend>
        <div className={styles.fields}>
          <label>
            Date preference
            <select {...register("dateMode")}>
              <option value="duration">Decide dates later</option>
              <option value="dates">Exact dates</option>
            </select>
          </label>
          {mode === "duration" ? (
            <label>
              Total days
              <input
                type="number"
                min={1}
                max={365}
                {...register("totalDays", { valueAsNumber: true })}
              />
            </label>
          ) : (
            <>
              <label>
                Start date
                <input type="date" {...register("startDate")} />
              </label>
              <label>
                End date
                <input type="date" {...register("endDate")} />
              </label>
            </>
          )}
        </div>
      </fieldset>
      <fieldset>
        <legend>Good company</legend>
        <label>
          Traveling as
          <select
            {...register("travelerType", {
              onChange: (e) => {
                const preset: Record<string, [number, number]> = {
                  solo: [1, 0],
                  couple: [2, 0],
                  friends: [3, 0],
                  family: [2, 2],
                  group: [4, 0],
                };
                const [adults, children] = preset[e.target.value];
                setValue("adults", adults, { shouldDirty: true });
                setValue("children", children, { shouldDirty: true });
              },
            })}
          >
            {["solo", "couple", "friends", "family", "group"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.fields}>
          <label>
            Adults
            <input
              type="number"
              min={1}
              max={20}
              {...register("adults", { valueAsNumber: true })}
            />
          </label>
          <label>
            Children
            <input
              type="number"
              min={0}
              max={20}
              {...register("children", { valueAsNumber: true })}
            />
          </label>
        </div>
        <label>
          Traveler names (optional)
          <input placeholder="Alex, Sam" {...register("names")} />
        </label>
      </fieldset>
      <fieldset>
        <legend>Your comfort zone</legend>
        <div className={styles.fields}>
          <label>
            Budget level
            <select {...register("budgetLevel")}>
              {["budget", "balanced", "premium", "custom"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          {level === "custom" && (
            <label>
              Total budget (USD)
              <input
                type="number"
                min={1}
                {...register("customAmount", { valueAsNumber: true })}
              />
            </label>
          )}
        </div>
        <p className={styles.note}>
          Estimates use local sample data, not live prices. Children use the
          same daily allowance as adults.
        </p>
      </fieldset>
      {Object.keys(errors).length > 0 && (
        <ul role="alert" className="text-sm text-destructive">
          {Object.entries(errors).map(([key, error]) => (
            <li key={key}>{error.message}</li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Apply trip details</Button>
        <span className={styles.note}>
          {isDirty
            ? "Changes apply when you save these details."
            : "Your current trip details."}
        </span>
      </div>
    </form>
  );
}
