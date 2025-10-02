import { useState, useMemo } from 'react';
import { InstagramProfile } from './types/profile';
import { initialProfiles } from './data/profiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RefreshCw, TrendingUp, Search, Users, UserPlus, Image, Heart, Eye, Instagram } from 'lucide-react';
import './App.css';

function App() {
  const [profiles, setProfiles] = useState<InstagramProfile[]>(initialProfiles);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProfile, setSelectedProfile] = useState<InstagramProfile | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const topTenProfiles = useMemo(() => {
    return [...profiles]
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 10);
  }, [profiles]);

  const searchResults = searchQuery
    ? profiles.filter(
        p =>
          p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectProfile = (profile: InstagramProfile) => {
    setSelectedProfile(profile);
    setSearchQuery('');
  };

  const handleRefreshLeaderboard = () => {
    setProfiles(prev =>
      prev.map(profile => ({
        ...profile,
        followers: profile.followers + Math.floor(Math.random() * 1000000) - 500000,
        latest_post_likes: profile.latest_post_likes + Math.floor(Math.random() * 500000) - 250000,
        latest_post_views: profile.latest_post_views
          ? profile.latest_post_views + Math.floor(Math.random() * 1000000) - 500000
          : null,
      }))
    );
    setLastRefresh(new Date());
  };

  const handleRefreshProfile = () => {
    if (selectedProfile) {
      const updated = profiles.find(p => p.username === selectedProfile.username);
      if (updated) {
        setSelectedProfile({
          ...updated,
          followers: updated.followers + Math.floor(Math.random() * 1000000) - 500000,
          latest_post_likes:
            updated.latest_post_likes + Math.floor(Math.random() * 500000) - 250000,
          latest_post_views: updated.latest_post_views
            ? updated.latest_post_views + Math.floor(Math.random() * 1000000) - 500000
            : null,
        });
      }
    }
    setLastRefresh(new Date());
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Instagram Rankings Dashboard
          </h1>
          <p className="text-slate-600">
            View top accounts leaderboard and search individual profiles
          </p>
        </div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="leaderboard">Top 10 Leaderboard</TabsTrigger>
            <TabsTrigger value="search">Search Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Top 10 Instagram Accounts</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Last updated: {lastRefresh.toLocaleString()}
                </p>
              </div>
              <Button onClick={handleRefreshLeaderboard}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Display Name</TableHead>
                        <TableHead className="text-right">Followers</TableHead>
                        <TableHead className="text-right">Following</TableHead>
                        <TableHead className="text-right">Posts</TableHead>
                        <TableHead className="text-right">Likes</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topTenProfiles.map((profile, index) => (
                        <TableRow key={profile.username}>
                          <TableCell className="font-medium">
                            <div className="flex items-center justify-center">
                              {index === 0 && <span className="text-2xl">🥇</span>}
                              {index === 1 && <span className="text-2xl">🥈</span>}
                              {index === 2 && <span className="text-2xl">🥉</span>}
                              {index > 2 && <span className="text-lg">#{index + 1}</span>}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-blue-600">
                            @{profile.username}
                          </TableCell>
                          <TableCell className="font-semibold">{profile.display_name}</TableCell>
                          <TableCell className="text-right font-bold text-blue-600">
                            {formatNumber(profile.followers)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(profile.following)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(profile.posts)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(profile.latest_post_likes)}
                          </TableCell>
                          <TableCell className="text-right">
                            {profile.latest_post_views
                              ? formatNumber(profile.latest_post_views)
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{profiles.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avg Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {formatNumber(
                      Math.round(
                        profiles.reduce((sum, p) => sum + p.followers, 0) / profiles.length
                      )
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-purple-600">
                    @{topTenProfiles[0]?.username}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatNumber(topTenProfiles[0]?.followers)} followers
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="search">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search Instagram Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Enter username or display name..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                    className="pl-10 text-base"
                  />
                </div>

                {searchQuery && searchResults.length > 0 && (
                  <div className="mt-4 border rounded-lg divide-y max-h-64 overflow-y-auto">
                    {searchResults.map(profile => (
                      <button
                        key={profile.username}
                        onClick={() => handleSelectProfile(profile)}
                        className="w-full p-3 hover:bg-slate-50 transition-colors text-left flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{profile.display_name}</p>
                          <p className="text-sm text-slate-500">@{profile.username}</p>
                        </div>
                        <p className="text-sm text-slate-600">
                          {formatNumber(profile.followers)} followers
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <p className="mt-4 text-center text-slate-500">No accounts found</p>
                )}
              </CardContent>
            </Card>

            {selectedProfile ? (
              <>
                <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="text-2xl">{selectedProfile.display_name}</CardTitle>
                      <p className="text-slate-500 mt-1">@{selectedProfile.username}</p>
                    </div>
                    <Button onClick={handleRefreshProfile} variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </CardHeader>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Followers</CardTitle>
                      <Users className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {formatNumber(selectedProfile.followers)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Following</CardTitle>
                      <UserPlus className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {formatNumber(selectedProfile.following)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                      <Image className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        {formatNumber(selectedProfile.posts)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Latest Post Likes</CardTitle>
                      <Heart className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">
                        {formatNumber(selectedProfile.latest_post_likes)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Latest Post Views</CardTitle>
                    <Eye className="h-4 w-4 text-slate-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {selectedProfile.latest_post_views
                        ? formatNumber(selectedProfile.latest_post_views)
                        : 'N/A'}
                    </div>
                  </CardContent>
                </Card>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Last updated: {lastRefresh.toLocaleString()}
                </p>
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <Instagram className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">
                    Search for an Instagram account to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
