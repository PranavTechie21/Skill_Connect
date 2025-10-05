import JobCard from "@/components/job-card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import JobSearch from "@/components/job-search";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, TrendingUp, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

export default function Jobs() {
  const [filters, setFilters] = useState({
    location: "",
    skills: [] as string[],
    jobType: "",
    search: "",
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const buildJobsQueryString = (
    filters: any,
    page: number,
    itemsPerPage: number
  ) => {
    const params = new URLSearchParams();
    if (filters.location) params.append("location", filters.location);
    if (filters.jobType) params.append("jobType", filters.jobType);
    if (filters.search) params.append("search", filters.search);
    if (filters.skills.length > 0) {
      filters.skills.forEach((skill: string) => params.append("skills", skill));
    }
    params.append("page", page.toString());
    params.append("itemsPerPage", itemsPerPage.toString());
    return params.toString();
  };

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["/api/jobs", { ...filters, page, itemsPerPage }],
    queryFn: async () => {
      const qs = buildJobsQueryString(filters, page, itemsPerPage);
      const response = await apiFetch(`/api/jobs${qs ? `?${qs}` : ""}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Rest of the file remains the same...
  const totalPages = Math.ceil((jobs.length || 0) / itemsPerPage);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover opportunities that match your skills and aspirations
          </p>
        </motion.div>

        <JobSearch onSearch={setFilters} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City, State..."
                      className="w-full p-2 border rounded-md"
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Job Type
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={filters.jobType}
                      onChange={(e) =>
                        setFilters({ ...filters, jobType: e.target.value })
                      }
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs list */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Jobs
                </h2>
                <p className="text-gray-600">
                  {jobs.length} jobs found
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job: any, index: number) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters to find more opportunities
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(1, page - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={pageNum === page}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}