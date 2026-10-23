import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  FileText,
  Filter,
  Gauge,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  Truck,
  Users,
  X
} from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  buildManagerAction,
  categoryOpportunity,
  chartPalette,
  coachingPriorities,
  confidenceTone,
  driverRecords,
  fiscalWeeks,
  formatCurrency,
  formatHours,
  formatShortCurrency,
  markets,
  nphMeasures,
  qualityTone,
  routeEvidence,
  weeklyTrend
} from './data/fixtures';
import { type DriverRecord, type NphMeasure, type Market, type FiscalWeek, type RouteEvidenceRecord } from './types';

type NavKey = 'overview' | 'driver-analysis' | 'route-evidence' | 'coaching-planner' | 'data-quality' | 'export-center';

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'driver-analysis', label: 'Driver Analysis', icon: Users },
  { key: 'route-evidence', label: 'Route Evidence', icon: BriefcaseBusiness },
  { key: 'coaching-planner', label: 'Coaching Planner', icon: Clipboard },
  { key: 'data-quality', label: 'Data Quality', icon: ShieldCheck },
  { key: 'export-center', label: 'Export Center', icon: Download }
] as const;

function Clipboard(props: any) {
  return <BarChart3 {...props} />;
}

function App() {
  const [activePage, setActivePage] = useState<NavKey>('overview');
  const [market, setMarket] = useState<Market>('Charlotte');
  const [fiscalWeek, setFiscalWeek] = useState<FiscalWeek>('Fiscal Week 39');
  const [nphMeasure, setNphMeasure] = useState<NphMeasure>('Stop NPH');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [driverQuery, setDriverQuery] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const filteredDrivers = useMemo(
    () => driverRecords.filter((driver) => driver.market === market),
    [market]
  );

  const activeDriver = useMemo(
    () => (selectedDriverId ? filteredDrivers.find((driver) => driver.id === selectedDriverId) ?? null : null),
    [filteredDrivers, selectedDriverId]
  );

  const totalOpportunityCost = filteredDrivers.reduce((sum, driver) => sum + driver.opportunityCost, 0);
  const totalOpportunityHours = filteredDrivers.reduce((sum, driver) => sum + driver.opportunityHours, 0);
  const totalDistinctSessions = filteredDrivers.reduce((sum, driver) => sum + driver.distinctSessions, 0);

  const filteredRouteEvidence = useMemo(() => {
    if (market !== 'Charlotte') return [];
    return routeEvidence.filter((record) => {
      const driverMatch = !driverQuery || record.driver.toLowerCase().includes(driverQuery.toLowerCase());
      return driverMatch;
    });
  }, [driverQuery, market]);

  const nphBanner = nphMeasure === 'Total NPH' ? (
    <div className='mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900'>
      <strong>Process-efficiency view:</strong> Total NPH is calculated at the scan-event level and should not be interpreted as Stop NPH.
    </div>
  ) : null;

  const renderPage = () => {
    if (market !== 'Charlotte') {
      return <EmptyState market={market} />;
    }

    switch (activePage) {
      case 'driver-analysis':
        return (
          <DriverAnalysisPage
            drivers={filteredDrivers}
            query={driverQuery}
            onQueryChange={setDriverQuery}
            onSelectDriver={setSelectedDriverId}
            selectedDriver={activeDriver}
          />
        );
      case 'route-evidence':
        return <RouteEvidencePage records={filteredRouteEvidence} />;
      case 'coaching-planner':
        return <CoachingPlannerPage drivers={filteredDrivers} />;
      case 'data-quality':
        return <DataQualityPage drivers={filteredDrivers} />;
      case 'export-center':
        return <ExportCenterPage />;
      default:
        return (
          <OverviewPage
            drivers={filteredDrivers}
            totalOpportunityCost={totalOpportunityCost}
            totalOpportunityHours={totalOpportunityHours}
            totalDistinctSessions={totalDistinctSessions}
            onSelectDriver={setSelectedDriverId}
          />
        );
    }
  };

  return (
    <div className='min-h-screen bg-slate-100 text-slate-800'>
      <div className='flex min-h-screen'>
        <aside className='hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex'>
          <div className='flex items-center gap-3 border-b border-slate-200 px-6 py-5'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-usf-orange'>
              <Truck className='h-6 w-6' />
            </div>
            <div>
              <div className='text-xl font-semibold text-slate-900'>NPH Insights</div>
              <div className='text-xs uppercase tracking-[0.18em] text-slate-500'>Transportation Performance</div>
            </div>
          </div>

          <nav className='flex-1 space-y-2 px-4 py-5'>
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type='button'
                onClick={() => {
                  setActivePage(key);
                  setMobileNavOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  activePage === key
                    ? 'bg-orange-50 text-usf-orange ring-1 ring-orange-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className='h-5 w-5' />
                <span className='font-medium'>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-40 bg-slate-900/30 lg:hidden'
              onClick={() => setMobileNavOpen(false)}
            >
              <motion.div
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -24, opacity: 0 }}
                onClick={(event) => event.stopPropagation()}
                className='h-full w-72 bg-white p-4 shadow-xl'
              >
                <div className='flex items-center justify-between border-b border-slate-200 pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-usf-orange'>
                      <Truck className='h-5 w-5' />
                    </div>
                    <div>
                      <div className='font-semibold text-slate-900'>NPH Insights</div>
                      <div className='text-[10px] uppercase tracking-[0.18em] text-slate-500'>Transportation Performance</div>
                    </div>
                  </div>
                  <button type='button' onClick={() => setMobileNavOpen(false)} className='rounded-lg p-2 hover:bg-slate-100'>
                    <X className='h-4 w-4' />
                  </button>
                </div>
                <div className='mt-4 space-y-2'>
                  {navItems.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type='button'
                      onClick={() => {
                        setActivePage(key);
                        setMobileNavOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${
                        activePage === key ? 'bg-orange-50 text-usf-orange' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className='h-5 w-5' />
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='flex-1'>
          <header className='sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm'>
            <div className='flex items-center justify-between px-4 py-3 md:px-6'>
              <div className='flex items-center gap-3'>
                <button type='button' className='rounded-xl p-2 hover:bg-slate-100 lg:hidden' onClick={() => setMobileNavOpen(true)}>
                  <Menu className='h-5 w-5' />
                </button>
                <div>
                  <div className='text-xs uppercase tracking-[0.16em] text-slate-500'>Market View</div>
                  <div className='text-lg font-semibold text-slate-900'>{market}</div>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 md:block'>
                  {fiscalWeek}
                </div>
                <div className='hidden rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-usf-orange md:block'>
                  {nphMeasure}
                </div>
              </div>
            </div>
          </header>

          <main className='p-4 md:p-6'>
            <section className='card-surface mb-5 p-4 md:p-5'>
              <div className='flex items-center gap-2 text-slate-900'>
                <Filter className='h-4 w-4 text-usf-orange' />
                <h2 className='text-lg font-semibold'>Analysis Scope</h2>
              </div>

              <div className='mt-4 grid gap-3 md:grid-cols-3'>
                <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
                  Market
                  <select
                    aria-label='Select market'
                    value={market}
                    onChange={(event) => setMarket(event.target.value as Market)}
                    className='rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-0 transition focus:border-orange-400'
                  >
                    {markets.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
                  Fiscal week
                  <select
                    aria-label='Select fiscal week'
                    value={fiscalWeek}
                    onChange={(event) => setFiscalWeek(event.target.value as FiscalWeek)}
                    className='rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-0 transition focus:border-orange-400'
                  >
                    {fiscalWeeks.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
                  NPH measure
                  <select
                    aria-label='Select NPH measure'
                    value={nphMeasure}
                    onChange={(event) => setNphMeasure(event.target.value as NphMeasure)}
                    className='rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-0 transition focus:border-orange-400'
                  >
                    {nphMeasures.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            {nphBanner}
            {renderPage()}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {activeDriver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-slate-900/40'
            onClick={() => setSelectedDriverId(null)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              onClick={(event) => event.stopPropagation()}
              className='absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-5 shadow-2xl'
            >
              <div className='mb-5 flex items-start justify-between gap-3'>
                <div>
                  <div className='text-sm font-medium uppercase tracking-[0.18em] text-slate-500'>Driver Detail</div>
                  <h3 className='mt-2 text-2xl font-semibold text-slate-900'>{activeDriver.name}</h3>
                </div>
                <button
                  type='button'
                  aria-label='Close driver detail'
                  onClick={() => setSelectedDriverId(null)}
                  className='rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>

              <div className='mb-5 flex flex-wrap gap-2'>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${confidenceTone[activeDriver.confidence]}`}>
                  {activeDriver.confidence} Confidence
                </span>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${qualityTone[activeDriver.dataQuality]}`}>
                  {activeDriver.dataQuality}
                </span>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <StatTile label='Opportunity Cost' value={formatCurrency(activeDriver.opportunityCost)} />
                <StatTile label='Distinct Sessions' value={String(activeDriver.distinctSessions)} />
              </div>

              <div className='mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <div className='text-xs font-medium uppercase tracking-[0.14em] text-slate-500'>Pattern Summary</div>
                <p className='mt-2 text-sm leading-6 text-slate-700'>{activeDriver.summary}</p>
              </div>

              <div className='mt-5 space-y-4'>
                <div>
                  <div className='text-xs font-medium uppercase tracking-[0.14em] text-slate-500'>Primary Evidence</div>
                  <ul className='mt-2 space-y-2 text-sm text-slate-700'>
                    <li><span className='font-medium text-slate-900'>Route ID:</span> {activeDriver.route}</li>
                    <li><span className='font-medium text-slate-900'>Session Date:</span> {activeDriver.sessionDate}</li>
                    <li><span className='font-medium text-slate-900'>Customer or Stop:</span> {activeDriver.customerOrLocation}</li>
                    <li><span className='font-medium text-slate-900'>Primary NPH Category:</span> {activeDriver.primaryCategory}</li>
                  </ul>
                </div>

                <div>
                  <div className='text-xs font-medium uppercase tracking-[0.14em] text-slate-500'>Recommended Manager Action</div>
                  <div className='mt-2 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-usf-orange'>
                    {buildManagerAction(activeDriver.confidence)}
                  </div>
                  <p className='mt-2 text-sm leading-6 text-slate-700'>{activeDriver.action}</p>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
      <div className='text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500'>{label}</div>
      <div className='mt-2 text-xl font-semibold text-slate-900'>{value}</div>
    </div>
  );
}

function OverviewPage({
  drivers,
  totalOpportunityCost,
  totalOpportunityHours,
  totalDistinctSessions,
  onSelectDriver
}: {
  drivers: DriverRecord[];
  totalOpportunityCost: number;
  totalOpportunityHours: number;
  totalDistinctSessions: number;
  onSelectDriver: (id: string) => void;
}) {
  const kpis = [
    {
      title: 'Stop Opportunity Cost',
      value: formatShortCurrency(totalOpportunityCost),
      note: 'Stop-level opportunity value for the selected market and week.',
      icon: CircleDollarSign,
      accent: 'bg-orange-50 text-usf-orange'
    },
    {
      title: 'Opportunity Hours',
      value: formatHours(totalOpportunityHours),
      note: 'Validated stop-level chance to recover lost minutes across the route population.',
      icon: Clock3,
      accent: 'bg-amber-50 text-amber-700'
    },
    {
      title: 'Distinct Route Sessions',
      value: totalDistinctSessions.toString(),
      note: 'Sessions used to measure recurrence while avoiding duplicate event counting.',
      icon: Gauge,
      accent: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'Data Compliance',
      value: '94.7%',
      note: 'High-confidence evidence remains in scope; review-based items are excluded from supported coaching.',
      icon: CheckCircle2,
      accent: 'bg-sky-50 text-sky-700'
    }
  ];

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {kpis.map((kpi) => (
          <div key={kpi.title} className='card-surface p-4'>
            <div className='flex items-start justify-between'>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.accent}`}>
                <kpi.icon className='h-5 w-5' />
              </div>
              <span className='rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500'>Demonstration Data</span>
            </div>
            <div className='mt-4 text-sm font-medium text-slate-500'>{kpi.title}</div>
            <div className='mt-2 text-3xl font-semibold text-slate-900'>{kpi.value}</div>
            <p className='mt-2 text-sm leading-6 text-slate-600'>{kpi.note}</p>
          </div>
        ))}
      </div>

      <section className='card-surface p-5'>
        <div className='flex items-center justify-between gap-2'>
          <div>
            <div className='text-xs font-medium uppercase tracking-[0.16em] text-slate-500'>Key Takeaway</div>
            <h3 className='mt-2 text-xl font-semibold text-slate-900'>Service and Pre-Scan activity represent the largest validated stop-level opportunities.</h3>
          </div>
        </div>
        <p className='mt-3 max-w-3xl text-sm leading-7 text-slate-600'>
          The strongest patterns recur across multiple distinct route sessions. Begin with the two highest-confidence drivers, while validating the isolated Unknown Stop event before coaching.
        </p>
      </section>

      <div className='grid gap-6 xl:grid-cols-2'>
        <section className='card-surface p-4 md:p-5'>
          <h3 className='section-title'>Weekly Stop NPH Opportunity</h3>
          <div className='mt-4 h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={weeklyTrend} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id='opportunityFill' x1='0' x2='0' y1='0' y2='1'>
                    <stop offset='0%' stopColor={chartPalette.orange} stopOpacity={0.32} />
                    <stop offset='100%' stopColor={chartPalette.orange} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='4 4' stroke='#cbd5e1' />
                <XAxis dataKey='week' tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
                <Area type='monotone' dataKey='opportunity' stroke={chartPalette.orange} fill='url(#opportunityFill)' strokeWidth={3} name='Opportunity Minutes' />
                <Area type='monotone' dataKey='baseline' stroke={chartPalette.green} strokeDasharray='6 6' fill='transparent' strokeWidth={2.5} name='Applicable Baseline' />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className='card-surface p-4 md:p-5'>
          <h3 className='section-title'>Opportunity by Category</h3>
          <div className='mt-4 h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={categoryOpportunity} layout='vertical' margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray='4 4' stroke='#e2e8f0' horizontal={false} />
                <XAxis type='number' tickLine={false} axisLine={false} />
                <YAxis dataKey='category' type='category' width={92} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => [`${value} minutes`, 'Stop Opportunity Minutes']} contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
                <Bar dataKey='minutes' radius={[0, 10, 10, 0]} fill={chartPalette.orange} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <TopDriverOpportunities drivers={drivers} onSelectDriver={onSelectDriver} />
    </div>
  );
}

function TopDriverOpportunities({ drivers, onSelectDriver }: { drivers: DriverRecord[]; onSelectDriver: (id: string) => void }) {
  const ranked = [...drivers].sort((a, b) => b.opportunityCost - a.opportunityCost).slice(0, 4);

  return (
    <section className='card-surface p-4 md:p-5'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='section-title'>Top Driver Opportunities</h3>
      </div>
      <div className='grid gap-4 lg:grid-cols-4'>
        {ranked.map((driver, index) => (
          <button
            key={driver.id}
            type='button'
            onClick={() => onSelectDriver(driver.id)}
            className='rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50'
          >
            <div className='flex items-center justify-between'>
              <span className='rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500'>Rank #{index + 1}</span>
              <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${confidenceTone[driver.confidence]}`}>{driver.confidence}</span>
            </div>
            <div className='mt-4 text-lg font-semibold text-slate-900'>{driver.name}</div>
            <div className='mt-2 text-sm text-slate-600'>{driver.primaryCategory}</div>
            <div className='mt-4 text-2xl font-semibold text-slate-900'>{formatCurrency(driver.opportunityCost)}</div>
            <div className='mt-2 text-sm text-slate-600'>{driver.distinctSessions} sessions</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function DriverAnalysisPage({
  drivers,
  query,
  onQueryChange,
  onSelectDriver,
  selectedDriver
}: {
  drivers: DriverRecord[];
  query: string;
  onQueryChange: (value: string) => void;
  onSelectDriver: (id: string) => void;
  selectedDriver: DriverRecord | null;
}) {
  const rankedDrivers = [...drivers].sort((a, b) => b.opportunityCost - a.opportunityCost).filter((driver) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;
    return [driver.name, driver.primaryCategory, driver.route].some((value) => value.toLowerCase().includes(normalized));
  });

  return (
    <div className='grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]'>
      <section className='card-surface p-4 md:p-5'>
        <div className='mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2'>
          <Search className='h-4 w-4 text-slate-500' />
          <input
            aria-label='Search drivers'
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder='Search by driver, NPH category, or route ID'
            className='w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400'
          />
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-[700px] w-full text-left'>
            <thead>
              <tr className='border-b border-slate-200 text-sm text-slate-600'>
                <th className='pb-3 pr-4 text-left font-medium'>Rank</th>
                <th className='pb-3 pr-4 text-left font-medium'>Driver</th>
                <th className='pb-3 pr-4 text-left font-medium'>Primary NPH Category</th>
                <th className='pb-3 pr-4 text-right font-medium'>Opportunity</th>
                <th className='pb-3 pr-4 text-right font-medium'>Distinct Sessions</th>
                <th className='pb-3 pr-4 text-left font-medium'>Evidence Confidence</th>
                <th className='pb-3 pr-4 text-left font-medium'>Data Status</th>
                <th className='pb-3 text-right font-medium'>View</th>
              </tr>
            </thead>
            <tbody>
              {rankedDrivers.map((driver, index) => (
                <tr key={driver.id} className='cursor-pointer border-b border-slate-100 transition hover:bg-slate-50'>
                  <td className='py-3 pr-4 text-sm font-medium text-slate-500'>#{index + 1}</td>
                  <td className='py-3 pr-4'>
                    <button type='button' className='text-left font-medium text-slate-900 hover:text-usf-orange' onClick={() => onSelectDriver(driver.id)}>
                      {driver.name}
                    </button>
                  </td>
                  <td className='py-3 pr-4 text-sm text-slate-700'>{driver.primaryCategory}</td>
                  <td className='py-3 pr-4 text-right text-sm font-semibold text-slate-900'>{formatCurrency(driver.opportunityCost)}</td>
                  <td className='py-3 pr-4 text-right text-sm text-slate-700'>{driver.distinctSessions}</td>
                  <td className='py-3 pr-4'>
                    <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-medium ${confidenceTone[driver.confidence]}`}>
                      {driver.confidence}
                    </span>
                  </td>
                  <td className='py-3 pr-4'>
                    <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-medium ${qualityTone[driver.dataQuality]}`}>
                      {driver.dataQuality}
                    </span>
                  </td>
                  <td className='py-3 text-right'>
                    <button type='button' onClick={() => onSelectDriver(driver.id)} className='inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white'>
                      View <ChevronRight className='h-3.5 w-3.5' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedDriver && (
        <aside className='card-surface hidden h-fit p-4 xl:block'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-xs uppercase tracking-[0.16em] text-slate-500'>Selected Driver</div>
              <h3 className='mt-1 text-xl font-semibold text-slate-900'>{selectedDriver.name}</h3>
            </div>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${confidenceTone[selectedDriver.confidence]}`}>
              {selectedDriver.confidence}
            </span>
          </div>
          <div className='mt-4 grid grid-cols-2 gap-3'>
            <StatTile label='Opportunity Cost' value={formatCurrency(selectedDriver.opportunityCost)} />
            <StatTile label='Distinct Sessions' value={String(selectedDriver.distinctSessions)} />
          </div>
          <div className='mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3'>
            <div className='text-xs uppercase tracking-[0.14em] text-slate-500'>Pattern Summary</div>
            <p className='mt-2 text-sm leading-6 text-slate-700'>{selectedDriver.summary}</p>
          </div>
          <div className='mt-4 space-y-3 text-sm text-slate-700'>
            <div><span className='font-semibold text-slate-900'>Route:</span> {selectedDriver.route}</div>
            <div><span className='font-semibold text-slate-900'>Session Date:</span> {selectedDriver.sessionDate}</div>
            <div><span className='font-semibold text-slate-900'>Customer or Stop:</span> {selectedDriver.customerOrLocation}</div>
            <div><span className='font-semibold text-slate-900'>Primary NPH Category:</span> {selectedDriver.primaryCategory}</div>
          </div>
          <div className='mt-4'>
            <div className='text-xs uppercase tracking-[0.14em] text-slate-500'>Recommended Manager Action</div>
            <div className='mt-2 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-usf-orange'>
              {buildManagerAction(selectedDriver.confidence)}
            </div>
            <p className='mt-2 text-sm leading-6 text-slate-700'>{selectedDriver.action}</p>
          </div>
        </aside>
      )}
    </div>
  );
}

function RouteEvidencePage({ records }: { records: RouteEvidenceRecord[] }) {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(records[0]?.id ?? null);
  const [selectedDriver, setSelectedDriver] = useState('All');
  const [selectedRoute, setSelectedRoute] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedConfidence, setSelectedConfidence] = useState('All');
  const [selectedQuality, setSelectedQuality] = useState('All');

  const filteredRecords = records.filter((record) => {
    return (
      (selectedDriver === 'All' || record.driver === selectedDriver) &&
      (selectedRoute === 'All' || record.routeId === selectedRoute) &&
      (selectedCustomer === 'All' || record.customerOrStop === selectedCustomer) &&
      (selectedCategory === 'All' || record.category === selectedCategory) &&
      (selectedConfidence === 'All' || record.confidence === selectedConfidence) &&
      (selectedQuality === 'All' || record.dataQualityStatus === selectedQuality)
    );
  });

  const selectedRecord = filteredRecords.find((record) => record.id === selectedRecordId) ?? filteredRecords[0] ?? null;
  const driversList = Array.from(new Set(records.map((record) => record.driver)));
  const routeList = Array.from(new Set(records.map((record) => record.routeId)));
  const customerList = Array.from(new Set(records.map((record) => record.customerOrStop)));
  const categoryList = Array.from(new Set(records.map((record) => record.category)));
  const confidenceList = Array.from(new Set(records.map((record) => record.confidence)));
  const qualityList = Array.from(new Set(records.map((record) => record.dataQualityStatus)));

  return (
    <div className='space-y-5'>
      <section className='card-surface p-4 md:p-5'>
        <div className='flex items-center gap-2'>
          <BriefcaseBusiness className='h-4 w-4 text-usf-orange' />
          <h3 className='section-title'>Route Evidence</h3>
        </div>
        <div className='mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6'>
          <FilterSelect label='Driver' value={selectedDriver} onChange={setSelectedDriver} options={['All', ...driversList]} />
          <FilterSelect label='Route' value={selectedRoute} onChange={setSelectedRoute} options={['All', ...routeList]} />
          <FilterSelect label='Customer' value={selectedCustomer} onChange={setSelectedCustomer} options={['All', ...customerList]} />
          <FilterSelect label='NPH Category' value={selectedCategory} onChange={setSelectedCategory} options={['All', ...categoryList]} />
          <FilterSelect label='Confidence' value={selectedConfidence} onChange={setSelectedConfidence} options={['All', ...confidenceList]} />
          <FilterSelect label='Data Quality' value={selectedQuality} onChange={setSelectedQuality} options={['All', ...qualityList]} />
        </div>
      </section>

      <section className='grid gap-4 lg:grid-cols-2'>
        {filteredRecords.length === 0 ? (
          <div className='card-surface p-6 text-sm text-slate-600'>No route evidence matches the current filters.</div>
        ) : (
          filteredRecords.map((record) => (
            <button
              key={record.id}
              type='button'
              onClick={() => setSelectedRecordId(record.id)}
              className={`card-surface p-4 text-left transition ${selectedRecord?.id === record.id ? 'border-orange-200 bg-orange-50/50' : 'bg-white'}`}
            >
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <div className='text-sm font-semibold text-slate-900'>{record.driver}</div>
                  <div className='text-xs uppercase tracking-[0.14em] text-slate-500'>{record.routeId}</div>
                </div>
                <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${confidenceTone[record.confidence]}`}>{record.confidence}</span>
              </div>
              <div className='mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600'>
                <div><span className='font-medium text-slate-900'>Customer/Stop:</span> {record.customerOrStop}</div>
                <div><span className='font-medium text-slate-900'>Category:</span> {record.category}</div>
                <div><span className='font-medium text-slate-900'>Actual:</span> {record.actualValue} mins</div>
                <div><span className='font-medium text-slate-900'>Baseline:</span> {record.baseline} mins</div>
                <div><span className='font-medium text-slate-900'>Variance:</span> {record.variance} mins</div>
                <div><span className='font-medium text-slate-900'>Opportunity:</span> {record.opportunityMinutes} mins</div>
              </div>
              <div className='mt-3 flex items-center justify-between'>
                <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${qualityTone[record.dataQualityStatus]}`}>{record.dataQualityStatus}</span>
                <span className='text-xs font-medium text-slate-500'>View details</span>
              </div>
            </button>
          ))
        )}
      </section>

      {selectedRecord && (
        <section className='card-surface p-4 md:p-5'>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='section-title'>Evidence Detail</h3>
            <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${qualityTone[selectedRecord.dataQualityStatus]}`}>
              {selectedRecord.dataQualityStatus}
            </span>
          </div>
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
            <DetailItem label='Driver' value={selectedRecord.driver} />
            <DetailItem label='Route ID' value={selectedRecord.routeId} />
            <DetailItem label='Route Session ID' value={selectedRecord.routeSessionId} />
            <DetailItem label='Session Date' value={selectedRecord.sessionDate} />
            <DetailItem label='Customer or Stop' value={selectedRecord.customerOrStop} />
            <DetailItem label='Record Type' value={selectedRecord.recordType} />
            <DetailItem label='NPH Category' value={selectedRecord.category} />
            <DetailItem label='Actual Value' value={`${selectedRecord.actualValue}`} />
            <DetailItem label='Baseline' value={`${selectedRecord.baseline}`} />
            <DetailItem label='Variance' value={`${selectedRecord.variance}`} />
            <DetailItem label='Opportunity Minutes' value={`${selectedRecord.opportunityMinutes}`} />
            <DetailItem label='Opportunity Cost' value={formatCurrency(selectedRecord.opportunityCost)} />
            <DetailItem label='Validation Flag' value={selectedRecord.validationFlag} />
          </div>
        </section>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3'>
      <div className='text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500'>{label}</div>
      <div className='mt-2 text-sm font-medium text-slate-800'>{value}</div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
      {label}
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className='rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-orange-400'
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function CoachingPlannerPage({ drivers }: { drivers: DriverRecord[] }) {
  return (
    <div className='space-y-6'>
      <section className='card-surface p-5'>
        <h2 className='text-2xl font-semibold text-slate-900'>Transportation Manager Coaching Planner — Charlotte</h2>
        <div className='mt-4 flex flex-wrap gap-3 text-sm text-slate-600'>
          <span className='rounded-full bg-slate-100 px-3 py-1.5'>Reporting Period: Fiscal Week 39</span>
          <span className='rounded-full bg-slate-100 px-3 py-1.5'>Focus: Top qualifying drivers by Stop Opportunity NPH Dollars</span>
        </div>
      </section>

      <section className='card-surface p-5'>
        <div className='text-xs font-medium uppercase tracking-[0.16em] text-slate-500'>Coaching Objective</div>
        <p className='mt-2 text-sm leading-7 text-slate-700'>
          Prioritize recurring Service, Pre-Scan, and AM opportunities using the supplied route-session evidence. Managers should validate unresolved data concerns, discuss operating conditions neutrally, and establish measurable improvement goals for supported patterns.
        </p>
      </section>

      <section className='grid gap-4 lg:grid-cols-3'>
        {coachingPriorities.map((priority) => (
          <div key={priority.title} className='card-surface p-4'>
            <div className='mb-2 text-lg font-semibold text-slate-900'>{priority.title}</div>
            <p className='text-sm leading-6 text-slate-700'>{priority.guidance}</p>
          </div>
        ))}
      </section>

      <section className='space-y-4'>
        {drivers.slice(0, 4).map((driver, index) => (
          <article key={driver.id} className='card-surface p-5'>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
              <div>
                <div className='text-xs uppercase tracking-[0.16em] text-slate-500'>Rank #{index + 1}</div>
                <h3 className='mt-2 text-xl font-semibold text-slate-900'>{driver.name}</h3>
              </div>
              <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${confidenceTone[driver.confidence]}`}>
                {driver.confidence} Confidence
              </span>
            </div>
            <p className='mt-4 text-sm leading-7 text-slate-700'>{driver.summary}</p>
            <div className='mt-3 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-usf-orange'>
              {buildManagerAction(driver.confidence)}
            </div>
            <p className='mt-3 text-sm leading-7 text-slate-700'>{driver.action}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

function DataQualityPage({ drivers }: { drivers: DriverRecord[] }) {
  const cleanCount = drivers.filter((driver) => driver.dataQuality === 'Clean Data').length;
  const reviewCount = drivers.filter((driver) => driver.dataQuality === 'Review Imputed/Adjusted').length;
  const validationCount = drivers.filter((driver) => driver.dataQuality === 'Data Validation Required').length;

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-3'>
        <SummaryCard title='Clean Driver Findings' value={cleanCount.toString()} />
        <SummaryCard title='Review Imputed/Adjusted' value={reviewCount.toString()} />
        <SummaryCard title='Validation Required' value={validationCount.toString()} />
      </div>

      <section className='card-surface p-5'>
        <div className='flex items-center gap-2 text-slate-900'>
          <ShieldCheck className='h-5 w-5 text-usf-green' />
          <h3 className='section-title'>Data Compliance</h3>
        </div>
        <div className='mt-4 flex items-end justify-between gap-3'>
          <div className='text-4xl font-semibold text-slate-900'>94.7%</div>
          <span className='inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>Within review range</span>
        </div>
        <div aria-label='Data compliance progress' className='mt-4 h-3 overflow-hidden rounded-full bg-slate-200'>
          <div className='h-full rounded-full bg-usf-green' style={{ width: '94.7%' }} />
        </div>
        <p className='mt-3 text-sm leading-7 text-slate-700'>
          The current sample maintains a strong compliance profile, but validation-required records are excluded from confirmed coaching conclusions. Review imputed or adjusted evidence before extending support for a managerial action.
        </p>
      </section>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className='card-surface p-4'>
      <div className='text-xs font-medium uppercase tracking-[0.14em] text-slate-500'>{title}</div>
      <div className='mt-3 text-3xl font-semibold text-slate-900'>{value}</div>
    </div>
  );
}

function ExportCenterPage() {
  const [market, setMarket] = useState<Market>('Charlotte');
  const [period, setPeriod] = useState<FiscalWeek>('Fiscal Week 39');
  const [outputFormat, setOutputFormat] = useState<'PowerPoint' | 'Word'>('PowerPoint');
  const [includedSections, setIncludedSections] = useState<string[]>(['Transportation Manager Coaching Planner', 'Driver Coaching Summary']);

  const toggleSection = (section: string) => {
    setIncludedSections((current) => (current.includes(section) ? current.filter((item) => item !== section) : [...current, section]));
  };

  return (
    <div className='space-y-6'>
      <section className='card-surface p-5'>
        <div className='flex items-center gap-2'>
          <Download className='h-4 w-4 text-usf-orange' />
          <h3 className='section-title'>Export Center</h3>
        </div>
        <div className='mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
          <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
            Market
            <select value={market} onChange={(event) => setMarket(event.target.value as Market)} className='rounded-xl border border-slate-200 bg-white px-3 py-2.5'>
              {markets.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
            Reporting period
            <select value={period} onChange={(event) => setPeriod(event.target.value as FiscalWeek)} className='rounded-xl border border-slate-200 bg-white px-3 py-2.5'>
              {fiscalWeeks.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
            Output format
            <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as 'PowerPoint' | 'Word')} className='rounded-xl border border-slate-200 bg-white px-3 py-2.5'>
              <option value='PowerPoint'>PowerPoint</option>
              <option value='Word'>Word</option>
            </select>
          </label>
          <div className='flex flex-col gap-2 text-sm font-medium text-slate-700'>
            Included sections
            <div className='flex flex-wrap gap-2'>
              {['Transportation Manager Coaching Planner', 'Market Executive Summary', 'Driver Coaching Summary', 'Data Quality Summary'].map((section) => (
                <button
                  key={section}
                  type='button'
                  onClick={() => toggleSection(section)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                    includedSections.includes(section) ? 'border-orange-200 bg-orange-50 text-usf-orange' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='card-surface p-5'>
        <div className='flex items-center gap-2 text-slate-900'>
          <FileText className='h-5 w-5 text-usf-orange' />
          <h3 className='section-title'>Preview</h3>
        </div>
        <p className='mt-4 text-sm leading-7 text-slate-700'>
          Export generation requires the approved document-generation service. The current framework provides the export configuration and preview experience only.
        </p>
        <div className='mt-4 flex flex-wrap gap-3'>
          <button type='button' className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700'>Preview</button>
          <button type='button' className='rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white'>Generate Export</button>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ market }: { market: string }) {
  return (
    <div className='card-surface flex min-h-[320px] items-center justify-center p-8 text-center'>
      <div>
        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
          <Building2 className='h-8 w-8' />
        </div>
        <h3 className='mt-4 text-xl font-semibold text-slate-900'>No records match this analysis scope</h3>
        <p className='mt-2 max-w-md text-sm leading-7 text-slate-600'>
          {market} demonstration records are not available in this prototype yet. Switch to Charlotte to review the NPH Insights demonstration data.
        </p>
      </div>
    </div>
  );
}

export default App;
