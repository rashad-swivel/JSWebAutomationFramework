<#
.SYNOPSIS

	Create the VP octopus deploy package
	
.DESCRIPTION
    
.PARAMETER sourceFolder

	The folder that contains the msbuild created file published content
	
.PARAMETER packageFolder

	The folder to create the octopus deploy compatible package in. This should be '$(build.artifactStagingDirectory)\'

.PARAMETER packageTitle

	The package title.  Defaults to 'Gtm_Automated_Tests'
		
.EXAMPLE
    & '.\Make Octopus Package.ps1' -sourceFolder "C:\Local VendorPanel Repos\GTM Automated Tests" -packageFolder "C:\temp\PublishingZip" -version "0.1.2.3"


#>

param(
    [parameter(Mandatory=$true)]
    [string]
    $sourceFolder,
    
    [parameter(Mandatory=$true)]
    [string]
    $packageFolder,
    
    [parameter(Mandatory=$false)]
    [string]
    $packageTitle = 'Gtm_Automated_Tests',

	[parameter(Mandatory=$true)]
    [string]
    $version
)

Set-StrictMode -Version 2.0

# build the final folder and zip file names
$tempFolder = "$packageFolder\$([System.Guid]::NewGuid().ToString())"
$finalZipFilename = "$packageFolder\$packageTitle.$version.zip"

#checking the folder to package things into exists	
# make sure the copied files exist
if($(Test-Path -Path "$packageFolder") -eq $false)
{
  throw "Unable to find '$packageFolder'. Script cannot continue." 
}

# copy from www folder to source root folder first
Write-Host 
Write-Host "Source folder is '$sourceFolder'"
#Write-Host "Making a temporary copy at '$tempFolder'"

Copy-Item -Path $sourceFolder -Destination $tempFolder -Recurse -Container


# make sure the copied files exist
if($(Test-Path -Path "$tempFolder") -eq $false)
{
   throw "The folder $tempFolder was not created. Script cannot continue." 
}
else 
{
    #Debug statements to see whats happening in poipeline machine
    #Write-host "Yay - found a folder called '$tempFolder'. Testing for copied folders:"
    #$foundFolders =Get-ChildItem -dir $tempFolder
    #foreach($aFile in $foundFolders)
    #{
    #   Write-Host "Found copied folder $aFile"
    #}
}

try
{
    $foldersToDelete = @(
        "Publishing",
        ".git",
        ".vscode"
        )

    #Write-Host 
    #Write-Host 'Removing folders not wanted in release package'
    foreach($folder in $foldersToDelete)
    {
        #Write-Host "Removing '$folder' from temporary copy"

        Remove-Item -Path $tempFolder\$folder -Recurse -Force
    }

    Write-Host 
    #Write-Host "Creating $finalZipFilename package"

    Compress-Archive -Path "$tempFolder\*" -DestinationPath $finalZipFilename -Force

    Write-Host "The package '$finalZipFilename' is ready for publishing"
}
finally
{
    #Write-Host 
    #Write-Host "Cleanup: Temporary folder '$tempFolder' removed"
    Remove-Item -Path $tempFolder -Recurse -Force
}
