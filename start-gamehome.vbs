Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\start-gamehome.bat" & Chr(34), 0
Set WshShell = Nothing
