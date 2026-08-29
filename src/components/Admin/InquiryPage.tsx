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
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Inquiries
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
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
            rounded-lg border px-4 py-2
            text-sm font-medium
            transition hover:bg-muted
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
        <div className="
          rounded-xl border
          bg-background p-5
        ">
          <div className="
            flex items-center
            justify-between
          ">
            <div>
              <p className="
                text-sm
                text-muted-foreground
              ">
                Total Inquiries
              </p>

              <h2 className="
                mt-2 text-3xl font-bold
              ">
                {stats.total}
              </h2>
            </div>

            <div className="
              rounded-lg bg-muted p-3
            ">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="
          rounded-xl border
          bg-background p-5
        ">
          <div className="
            flex items-center
            justify-between
          ">
            <div>
              <p className="
                text-sm
                text-muted-foreground
              ">
                Get Started
              </p>

              <h2 className="
                mt-2 text-3xl font-bold
              ">
                {stats.getStarted}
              </h2>
            </div>

            <div className="
              rounded-lg bg-muted p-3
            ">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Book Demo */}
        <div className="
          rounded-xl border
          bg-background p-5
        ">
          <div className="
            flex items-center
            justify-between
          ">
            <div>
              <p className="
                text-sm
                text-muted-foreground
              ">
                Book a Demo
              </p>

              <h2 className="
                mt-2 text-3xl font-bold
              ">
                {stats.bookDemo}
              </h2>
            </div>

            <div className="
              rounded-lg bg-muted p-3
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
            rounded-lg px-4 py-2
            text-sm font-medium transition

            ${
              filter === "ALL"
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-muted"
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
            rounded-lg px-4 py-2
            text-sm font-medium transition

            ${
              filter === "GET_STARTED"
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-muted"
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
            rounded-lg px-4 py-2
            text-sm font-medium transition

            ${
              filter === "BOOK_A_DEMO"
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-muted"
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
          border-destructive/50
          bg-destructive/10
          p-4 text-sm
          text-destructive
        ">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="
          flex min-h-[300px]
          items-center justify-center
          rounded-xl border
        ">
          <div className="text-sm text-muted-foreground">
            Loading inquiries...
          </div>
        </div>
      ) : (

        <div className="
          overflow-hidden
          rounded-xl border
        ">

          <div className="overflow-x-auto">

            <table className="
              w-full text-sm
            ">

              <thead className="
                border-b bg-muted/50
              ">
                <tr>
                  <th className="
                    px-6 py-4 text-left
                    font-medium
                  ">
                    Email
                  </th>

                  <th className="
                    px-6 py-4 text-left
                    font-medium
                  ">
                    Inquiry Type
                  </th>

                  <th className="
                    px-6 py-4 text-left
                    font-medium
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
                        text-muted-foreground
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
                        transition hover:bg-muted/40
                      "
                    >

                      {/* Email */}
                      <td className="px-6 py-4">

                        <div className="
                          flex items-center gap-3
                        ">
                          <Mail className="
                            h-4 w-4
                            text-muted-foreground
                          " />

                          <a
                            href={`mailto:${inquiry.email}`}
                            className="
                              font-medium
                              hover:underline
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
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
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
                        text-muted-foreground
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

    </div>
  );
}