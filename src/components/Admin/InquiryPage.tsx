import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Mail,
  RefreshCw,
  Users,
} from "lucide-react";

import {
  getInquiries,
} from "../../api/inquiry";

import type {
  Inquiry,
  InquiryType,
} from "../../types/inquiry";

type FilterType = "ALL" | InquiryType;

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] =
    useState<FilterType>("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const fetchInquiries = async (
    selectedType: FilterType = filter,
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await getInquiries(
        selectedType === "ALL"
          ? undefined
          : selectedType
      );

      setInquiries(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load inquiries"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const stats = useMemo(() => {
    return {
      total: inquiries.length,

      getStarted: inquiries.filter(
        (item) => item.type === "GET_STARTED"
      ).length,

      bookDemo: inquiries.filter(
        (item) => item.type === "BOOK_A_DEMO"
      ).length,
    };
  }, [inquiries]);

  const handleFilterChange = (
    value: FilterType
  ) => {
    setFilter(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(date));
  };

  const getTypeLabel = (
    type: InquiryType
  ) => {
    switch (type) {
      case "GET_STARTED":
        return "Get Started";

      case "BOOK_A_DEMO":
        return "Book a Demo";

      default:
        return type;
    }
  };

  return (
    <section className="min-h-full space-y-6 bg-surface p-5 text-on-surface sm:p-7 lg:p-10">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary">Administration / Inbox</p>
          <h1 className="mt-1 font-headline text-3xl text-primary">
            Inquiries
          </h1>

          <p className="mt-1 text-sm text-on-surface-variant">
            Manage and monitor website inquiries.
          </p>
        </div>

        <button
          onClick={() =>
            fetchInquiries(filter, true)
          }
          disabled={refreshing}
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-2
            text-sm font-medium
            text-primary transition hover:bg-surface-container-high
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="
        grid gap-4
        md:grid-cols-3
      ">

        {/* Total */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <div className="
            flex items-center
            justify-between
          ">
            <div>
              <p className="
                text-[10px] uppercase tracking-wider text-on-surface-variant
              ">
                Total Inquiries
              </p>

              <h2 className="
                mt-2 font-headline text-3xl text-primary
              ">
                {stats.total}
              </h2>
            </div>

            <div className="
              rounded-lg bg-primary/10 p-3 text-primary
            ">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <div className="
            flex items-center
            justify-between
          ">
            <div>
              <p className="
                text-[10px] uppercase tracking-wider text-on-surface-variant
              ">
                Get Started
              </p>

              <h2 className="
                mt-2 font-headline text-3xl text-primary
              ">
                {stats.getStarted}
              </h2>
            </div>

            <div className="
              rounded-lg bg-primary/10 p-3 text-primary
            ">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Book Demo */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <div className="
            flex items-center
            justify-between
          ">
            <div>
              <p className="
                text-[10px] uppercase tracking-wider text-on-surface-variant
              ">
                Book a Demo
              </p>

              <h2 className="
                mt-2 font-headline text-3xl text-primary
              ">
                {stats.bookDemo}
              </h2>
            </div>

            <div className="
              rounded-lg bg-tertiary/10 p-3 text-tertiary
            ">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>

      </div>

      {/* Filter */}
      <div className="
        flex flex-wrap gap-2
      ">

        <button
          onClick={() =>
            handleFilterChange("ALL")
          }
          className={`
            rounded-lg border px-4 py-2 text-sm font-medium transition

            ${
              filter === "ALL"
                ? "border-primary bg-primary text-on-primary"
                : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
            }
          `}
        >
          All
        </button>

        <button
          onClick={() =>
            handleFilterChange("GET_STARTED")
          }
          className={`
            rounded-lg border px-4 py-2 text-sm font-medium transition

            ${
              filter === "GET_STARTED"
                ? "border-primary bg-primary text-on-primary"
                : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
            }
          `}
        >
          Get Started
        </button>

        <button
          onClick={() =>
            handleFilterChange("BOOK_A_DEMO")
          }
          className={`
            rounded-lg border px-4 py-2 text-sm font-medium transition

            ${
              filter === "BOOK_A_DEMO"
                ? "border-primary bg-primary text-on-primary"
                : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
            }
          `}
        >
          Book a Demo
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="
          rounded-lg border
          border-error/30
          bg-error/10
          p-4 text-sm
          text-error
        ">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="
          flex min-h-75
          items-center justify-center
          rounded-xl border border-outline-variant/20 bg-surface-container-lowest
        ">
          <div className="text-sm text-on-surface-variant">
            Loading inquiries...
          </div>
        </div>
      ) : (

        <div className="
          overflow-hidden
          rounded-xl border border-outline-variant/20 bg-surface-container-lowest
        ">

          <div className="overflow-x-auto">

            <table className="
              w-full text-sm
            ">

              <thead className="
                border-b border-outline-variant/20 bg-surface-container-low
              ">
                <tr>
                  <th className="
                    px-6 py-4 text-left
                    font-medium text-on-surface-variant
                  ">
                    Email
                  </th>

                  <th className="
                    px-6 py-4 text-left
                    font-medium text-on-surface-variant
                  ">
                    Inquiry Type
                  </th>

                  <th className="
                    px-6 py-4 text-left
                    font-medium text-on-surface-variant
                  ">
                    Date & Time
                  </th>
                </tr>
              </thead>

              <tbody>

                {inquiries.length === 0 ? (

                  <tr>
                    <td
                      colSpan={3}
                      className="
                        px-6 py-16
                        text-center
                        text-on-surface-variant
                      "
                    >
                      No inquiries found.
                    </td>
                  </tr>

                ) : (

                  inquiries.map((inquiry) => (

                    <tr
                      key={inquiry.id}
                      className="
                        border-b last:border-0
                        border-outline-variant/15 transition hover:bg-surface-container-low
                      "
                    >

                      {/* Email */}
                      <td className="px-6 py-4">

                        <div className="
                          flex items-center gap-3
                        ">
                          <Mail className="
                            h-4 w-4 text-primary
                          " />

                          <a
                            href={`mailto:${inquiry.email}`}
                            className="
                              font-medium text-primary hover:underline
                            "
                          >
                            {inquiry.email}
                          </a>
                        </div>

                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3 py-1
                            text-xs font-medium

                            ${
                              inquiry.type ===
                              "GET_STARTED"
                                ? "bg-primary-container text-on-primary-container"
                                : "bg-tertiary-container text-on-tertiary-container"
                            }
                          `}
                        >
                          {getTypeLabel(
                            inquiry.type
                          )}
                        </span>

                      </td>

                      {/* Date */}
                      <td className="
                        px-6 py-4
                        text-on-surface-variant
                      ">
                        {formatDate(
                          inquiry.createdAt
                        )}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </section>
  );
}