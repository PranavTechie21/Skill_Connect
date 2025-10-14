import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AdminBackButton from "@/components/AdminBackButton"
import { useTheme } from "@/components/theme-provider";

export default function Stories() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <AdminBackButton />
        </div>
        <h1 className="text-3xl font-bold mb-6">Stories</h1>
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Stories</h2>
            <p className="text-muted-foreground">
              Share your company's culture, values, and achievements through stories.
            </p>
            <Button variant="default">Create New Story</Button>
            <div className="mt-8">
              <p className="text-center text-muted-foreground">No stories yet. Start sharing your company's journey!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}