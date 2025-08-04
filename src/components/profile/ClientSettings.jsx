//
// import { useState } from "react"
// import {Lock, Bell, Shield, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react"
//
// export default function Settings() {
//     const [showCurrentPassword, setShowCurrentPassword] = useState(false)
//     const [showNewPassword, setShowNewPassword] = useState(false)
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//     const [passwordForm, setPasswordForm] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     })
//     const [deleteConfirmation, setDeleteConfirmation] = useState("")
//     const [notifications, setNotifications] = useState({
//         email: true,
//         sms: false,
//         appointments: true,
//         reminders: true,
//         marketing: false,
//     })
//
//     const handlePasswordChange = (e) => {
//         e.preventDefault()
//         console.log("Password change submitted")
//     }
//
//     const handleDeleteAccount = () => {
//         console.log("Account deletion confirmed")
//     }
//
//     return (
//         <div className="container max-w-4xl mx-auto p-6 space-y-6">
//             <div className="space-y-2">
//                 <h1 className="text-3xl font-bold">Settings</h1>
//                 <p className="text-muted-foreground">Manage your account settings and preferences</p>
//             </div>
//
//             <Tabs defaultValue="profile" className="space-y-6">
//                 <TabsList className="grid w-full grid-cols-4">
//                     <TabsTrigger value="security" className="flex items-center gap-2">
//                         <Lock className="h-4 w-4" />
//                         Security
//                     </TabsTrigger>
//                     <TabsTrigger value="notifications" className="flex items-center gap-2">
//                         <Bell className="h-4 w-4" />
//                         Notifications
//                     </TabsTrigger>
//                     <TabsTrigger value="privacy" className="flex items-center gap-2">
//                         <Shield className="h-4 w-4" />
//                         Privacy
//                     </TabsTrigger>
//                 </TabsList>
//
//                 <TabsContent value="security" className="space-y-6">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Change Password</CardTitle>
//                             <CardDescription>Update your password to keep your account secure</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <form onSubmit={handlePasswordChange} className="space-y-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="current-password">Current Password</Label>
//                                     <div className="relative">
//                                         <Input
//                                             id="current-password"
//                                             type={showCurrentPassword ? "text" : "password"}
//                                             value={passwordForm.currentPassword}
//                                             onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
//                                             required
//                                         />
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                                             onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                                         >
//                                             {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                                         </Button>
//                                     </div>
//                                 </div>
//
//                                 <div className="space-y-2">
//                                     <Label htmlFor="new-password">New Password</Label>
//                                     <div className="relative">
//                                         <Input
//                                             id="new-password"
//                                             type={showNewPassword ? "text" : "password"}
//                                             value={passwordForm.newPassword}
//                                             onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
//                                             required
//                                         />
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                                             onClick={() => setShowNewPassword(!showNewPassword)}
//                                         >
//                                             {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                                         </Button>
//                                     </div>
//                                 </div>
//
//                                 <div className="space-y-2">
//                                     <Label htmlFor="confirm-password">Confirm New Password</Label>
//                                     <div className="relative">
//                                         <Input
//                                             id="confirm-password"
//                                             type={showConfirmPassword ? "text" : "password"}
//                                             value={passwordForm.confirmPassword}
//                                             onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
//                                             required
//                                         />
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                         >
//                                             {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                                         </Button>
//                                     </div>
//                                 </div>
//
//                                 <Alert>
//                                     <CheckCircle className="h-4 w-4" />
//                                     <AlertDescription>
//                                         Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special
//                                         characters.
//                                     </AlertDescription>
//                                 </Alert>
//
//                                 <Button type="submit">Update Password</Button>
//                             </form>
//                         </CardContent>
//                     </Card>
//
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Two-Factor Authentication</CardTitle>
//                             <CardDescription>Add an extra layer of security to your account</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <div className="space-y-1">
//                                     <p className="font-medium">SMS Authentication</p>
//                                     <p className="text-sm text-muted-foreground">Receive verification codes via text message</p>
//                                 </div>
//                                 <Switch />
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <div className="space-y-1">
//                                     <p className="font-medium">Authenticator App</p>
//                                     <p className="text-sm text-muted-foreground">Use an authenticator app for verification codes</p>
//                                 </div>
//                                 <Switch />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//
//                 <TabsContent value="notifications" className="space-y-6">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Notification Preferences</CardTitle>
//                             <CardDescription>Choose how you want to be notified about important updates</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-6">
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <div className="space-y-1">
//                                         <p className="font-medium">Email Notifications</p>
//                                         <p className="text-sm text-muted-foreground">Receive notifications via email</p>
//                                     </div>
//                                     <Switch
//                                         checked={notifications.email}
//                                         onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
//                                     />
//                                 </div>
//
//                                 <div className="flex items-center justify-between">
//                                     <div className="space-y-1">
//                                         <p className="font-medium">SMS Notifications</p>
//                                         <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
//                                     </div>
//                                     <Switch
//                                         checked={notifications.sms}
//                                         onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sms: checked }))}
//                                     />
//                                 </div>
//
//                                 <Separator />
//
//                                 <div className="flex items-center justify-between">
//                                     <div className="space-y-1">
//                                         <p className="font-medium">Appointment Reminders</p>
//                                         <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
//                                     </div>
//                                     <Switch
//                                         checked={notifications.appointments}
//                                         onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, appointments: checked }))}
//                                     />
//                                 </div>
//
//                                 <div className="flex items-center justify-between">
//                                     <div className="space-y-1">
//                                         <p className="font-medium">Session Reminders</p>
//                                         <p className="text-sm text-muted-foreground">Reminders for homework and follow-ups</p>
//                                     </div>
//                                     <Switch
//                                         checked={notifications.reminders}
//                                         onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, reminders: checked }))}
//                                     />
//                                 </div>
//
//                                 <div className="flex items-center justify-between">
//                                     <div className="space-y-1">
//                                         <p className="font-medium">Marketing Communications</p>
//                                         <p className="text-sm text-muted-foreground">Updates about new features and services</p>
//                                     </div>
//                                     <Switch
//                                         checked={notifications.marketing}
//                                         onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketing: checked }))}
//                                     />
//                                 </div>
//                             </div>
//
//                             <Button>Save Preferences</Button>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//
//                 <TabsContent value="privacy" className="space-y-6">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Privacy Settings</CardTitle>
//                             <CardDescription>Control your privacy and data sharing preferences</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-6">
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <div className="space-y-1">
//                                         <p className="font-medium">Profile Visibility</p>
//                                         <p className="text-sm text-muted-foreground">
//                                             Show your profile to matched therapists                                        </p>
//                                     </div>
//                                     <Switch defaultChecked />
//                                 </div>
//
//                                 <div className="flex items-center justify-between">
//                                     <div className="space-y-1">
//                                         <p className="font-medium">Data Analytics</p>
//                                         <p className="text-sm text-muted-foreground">Help improve our services with anonymous usage data</p>
//                                     </div>
//                                     <Switch defaultChecked />
//                                 </div>
//
//                             </div>
//
//                             <Separator />
//
//                             <div className="space-y-4">
//                                 <h4 className="font-medium">Data Export & Deletion</h4>
//                                 <div className="flex gap-4">
//                                     <Button variant="outline">Export My Data</Button>
//                                     <Button variant="outline">Download Session History</Button>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//
//                     <Card className="border-destructive">
//                         <CardHeader>
//                             <CardTitle className="text-destructive flex items-center gap-2">
//                                 <Trash2 className="h-5 w-5" />
//                                 Delete Account
//                             </CardTitle>
//                             <CardDescription>
//                                 Permanently delete your account and all associated data. This action cannot be undone.
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                             <Alert>
//                                 <AlertTriangle className="h-4 w-4" />
//                                 <AlertDescription>
//                                     <strong>Warning:</strong> Deleting your account will permanently remove all your data, including{" "}
//                                     session history, progress notes, and personal information
//                                     . This action cannot be reversed.
//                                 </AlertDescription>
//                             </Alert>
//
//                             <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                     <Button variant="destructive">Delete Account</Button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent>
//                                     <AlertDialogHeader>
//                                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                                         <AlertDialogDescription className="space-y-4">
//                                             <p>
//                                                 This will permanently delete your account and remove all your data from our servers. This action
//                                                 cannot be undone.
//                                             </p>
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="delete-confirmation">
//                                                     Type <strong>DELETE</strong> to confirm:
//                                                 </Label>
//                                                 <Input
//                                                     id="delete-confirmation"
//                                                     value={deleteConfirmation}
//                                                     onChange={(e) => setDeleteConfirmation(e.target.value)}
//                                                     placeholder="Type DELETE here"
//                                                 />
//                                             </div>
//                                         </AlertDialogDescription>
//                                     </AlertDialogHeader>
//                                     <AlertDialogFooter>
//                                         <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Cancel</AlertDialogCancel>
//                                         <AlertDialogAction
//                                             onClick={handleDeleteAccount}
//                                             disabled={deleteConfirmation !== "DELETE"}
//                                             className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                                         >
//                                             Delete Account
//                                         </AlertDialogAction>
//                                     </AlertDialogFooter>
//                                 </AlertDialogContent>
//                             </AlertDialog>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     )
// }
