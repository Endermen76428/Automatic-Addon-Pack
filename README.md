# Automatic-Addon-Pack
A way to create an automatic addon pack like a java mod pack

# Addonpacks for Minecraft Bedrock Edition — Modpack-like Profiles

## 1. Introduction

Have you ever wanted to play Minecraft Bedrock with several addons installed at once, without having to spend time downloading, installing, and organizing each one individually?

On Minecraft Java Edition, CurseForge already makes this experience very simple through Modpacks. Players can create profiles, add or remove mods, manage updates, and launch the game with everything already configured.

Unfortunately, Minecraft Bedrock Edition does not offer the same experience.

I would like to propose bringing a similar system to Bedrock Edition through **Addonpacks**: customizable profiles where players can collect multiple addons, organize them, manage their updates, and install everything together with a single download.

The goal is to make managing addons on Bedrock as convenient as managing mods on Java, while preserving the existing projects, downloads, and rewards of addon creators.

## 2. The Current Problem

Unlike Java Edition, Minecraft Bedrock handles addons differently.

Instead of having a single collection of mods that can be enabled or disabled through a profile, players must install addons individually and then manually add them to each world they want to play.

There is also another important detail: Behavior Packs and Resource Packs have separate loading orders, which players must configure themselves.

This creates several inconveniences:

- Every addon must be downloaded and installed individually.
- Players must manually activate addons in their worlds.
- The loading order must be configured separately for Behavior Packs and Resource Packs.
- Repeating this process for another world requires doing much of the work again.
- **Sharing** a collection of **addons with other players is not as straightforward** as sharing a Java Modpack.

This makes larger addon collections unnecessarily time-consuming to install and manage.

## 3. The Proposed Solution: Addonpacks

The idea is to introduce a profile management system similar to the existing Modpack functionality on Java Edition.

Players would be able to create a new profile, give it a name, and add any addons available on CurseForge.

Each profile would have two separate lists:

- **Behavior Packs:** For managing the addons that modify gameplay and game behavior.
- **Resource Packs:** For managing the addons that modify textures, sounds, and other visual or audio elements.

Players could search for addons directly within the profile, select the files they want to use, and arrange them in any order through a simple drag-and-drop interface.

The selected order would be preserved when generating the Addonpack, allowing players to configure their collections without having to manually repeat the entire installation process.

### 3.1. Adding Addons

When adding an addon, players would search for its name using a search bar, similar to the dependency selection interface already available in the CurseForge project dashboard.

After finding a project, players could select which files they want to include.

Some creators publish Behavior Packs and Resource Packs as separate files. In these cases, the player would select the files and specify which type each one represents.

However, when a creator publishes a single `.mcaddon` containing both packs, CurseForge should automatically recognize and categorize them.

Once selected, the addons would appear at the top of their respective lists, where players could freely change their positions.

### 3.2. Dependencies

Addons that require other addons to function should have their dependencies automatically added to the profile.

When this happens, CurseForge should notify the player and indicate which addon requires the newly added dependency.

This would help prevent incomplete addon installations and make managing larger collections easier.

### 3.3. Updates and File Availability

Each profile should offer an option to enable or disable automatic addon updates, following the same concept already available for Java Modpacks.

When automatic updates are enabled, CurseForge would select the latest available files for the addons in the profile.

When disabled, the player would retain the files they originally selected until they decide to update them manually.

If a creator removes a file, CurseForge should attempt to select the latest available replacement from the same project, following the original file configuration whenever possible.

If CurseForge cannot find or identify a suitable replacement, the addon should be marked as unavailable, displaying an X over its entry.

Unavailable addons would not be included when generating the Addonpack, making it clear to the player that their profile requires attention.

Since Bedrock Edition does not provide the same supported game-version selection options as Java Edition, the system should focus on the latest supported Minecraft Bedrock version rather than offering a version selector.

## 4. Installing and Reusing Addonpacks

After configuring a profile, the player would simply click a button to download their Addonpack.

CurseForge would download the selected addons, organize their files, and generate a `.mctemplate` containing the entire collection.

The player would then only need to open the generated file with Minecraft Bedrock to import it.

The imported template would be available inside the game, allowing players to create as many worlds as they want using the same collection of addons.

This also introduces two complementary ways of managing Addonpacks:

- **CurseForge profiles:** A digital repository where players manage their addon collections, select files, configure updates, and change the loading order.
- **Minecraft world templates:** A reusable in-game template containing the selected addons and their configurations, ready to create new worlds.

It is important to mention that an already downloaded `.mctemplate` would not change automatically when its original CurseForge profile is modified. Players would need to generate and download a new template to obtain the updated configuration.

## 5. Publishing and Sharing Addonpacks

In addition to private profiles, players should have the option to publish their profiles as official Addonpack projects on CurseForge.

This would allow the community to create, discover, and share complete addon collections in the same way they currently share Modpacks on Java Edition.

Published Addonpacks would have their own project pages, including the usual project information, such as:

- Name and description.
- Thumbnail and images.
- Creator information.
- List of included addons.
- Download statistics.
- Available updates.

Publishing an Addonpack would require the same basic project information currently required when creating a new CurseForge project.

Public Addonpacks should also be updated automatically whenever their organizer updates the corresponding profile. This would keep the published collection up to date without requiring users to manually find and download a new version.

As with private profiles, updating an Addonpack on CurseForge would not modify worlds that players have already imported into Minecraft. The updated template would be available for subsequent downloads and world creation.

## 6. Technical Implementation

I recently found a possible way to implement this functionality using Minecraft Bedrock's existing `.mctemplate` format.

The following is a proposed implementation based on how Bedrock world files are structured.

### 6.1. World Pack Configuration

When exporting a Minecraft world, its configuration includes two important files:

- `world_behavior_packs.json`
- `world_resource_packs.json`

Both files contain arrays of entries identifying the installed packs through their UUIDs and versions.

These entries also determine the order in which the packs are loaded.

This means CurseForge could generate these two files directly from the player's profile, preserving the exact order configured in the Behavior Pack and Resource Pack lists.

### 6.2. Extracting and Organizing Addons

When generating an Addonpack, CurseForge would:

1. Download all selected addon files.
2. Extract their contents.
3. Place the Behavior Packs and Resource Packs into their respective world directories.
4. Generate `world_behavior_packs.json` and `world_resource_packs.json` using the UUIDs, versions, and loading orders defined in the profile.

This would allow Bedrock to recognize and load all the selected addons without requiring players to manually install and activate each one.

### 6.3. Generating the World Template

A possible approach would be to generate a predefined `level.dat` containing the default world settings, without enabling cheats or disabling achievements.

Based on my findings, exporting a world and removing its `db` folder allows Minecraft to regenerate the world data while retaining its configuration. This behavior could potentially be used to create a template that generates a fresh world rather than repeatedly creating copies of an existing map.

The template would then contain:

- A `level.dat` with the predefined world settings.
- A template `manifest.json` containing the profile name and required metadata.
- The `world_behavior_packs.json` file.
- The `world_resource_packs.json` file.
- The directories containing all extracted Behavior Packs and Resource Packs.

Finally, all these files and directories would be compressed into a `.mctemplate` file.

This would allow CurseForge to generate a fully configured Minecraft world template without requiring users to manually handle any of the internal files.

Additional world settings, such as Education Edition and experimental features, could also be investigated to determine whether they can be configured through this process.

## 7. Creator Benefits and Monetization

One important aspect of this proposal is ensuring that Addonpacks benefit addon creators rather than taking away their existing downloads and revenue.

**Every addon included in an Addonpack should remain linked to its original CurseForge project.**

This means that when a player downloads an Addonpack, the included addon projects would receive their respective download counts and creator rewards, just as they would through individual downloads.

However, generating an Addonpack involves several operations, including downloading multiple files, extracting their contents, organizing the packs, and compressing everything into a `.mctemplate`.

This process could provide an additional opportunity for CurseForge monetization.

### 7.1. Advertising During Addonpack Generation

Similar to the existing individual addon download process, CurseForge could display advertisements while preparing the Addonpack.

Currently, individual downloads display advertisements and use a short countdown before the download begins.

For Addonpacks, this countdown could be adjusted proportionally to the amount of work required for the entire collection.

The revenue generated during this process could then be distributed among the creators whose addons are included in the collection.

### 7.2. Revenue Distribution

The proposed distribution system would consider the number of addons contributed by each creator.

For example, a creator whose projects contribute five addons to an Addonpack should receive a larger share than a creator whose project contributes only one.

This would ensure that the distribution reflects the amount of content each creator provides, rather than dividing the revenue equally regardless of their contribution.

Additionally, creators who organize and publish official Addonpacks could receive a smaller share of the revenue generated through their collections, based on their Addonpack's download count.

This additional reward would only apply to publicly published Addonpacks, not private profiles.

The organizer's share should always remain smaller than the share received by the creators who provide the actual addons.

The exact percentages and distribution rules could be determined by CurseForge.

## 8. Benefits for the CurseForge Community

Introducing Addonpacks could bring several benefits to the Minecraft Bedrock community.

**For players:**
- Much faster and simpler addon installation.
- Easier management of large addon collections.
- No need to manually install and organize every addon.
- Reusable world templates for creating multiple worlds.
- Easier sharing and discovery of addon collections.

**For addon creators:**
- Their original projects remain linked to every Addonpack.
- Individual download statistics continue to be counted.
- Their existing creator rewards are preserved.
- Additional revenue opportunities through Addonpack generation.

**For CurseForge:**
- A more complete addon management experience for Bedrock Edition.
- Greater accessibility for players who are unfamiliar with manual addon installation.
- More opportunities for project discovery and downloads.
- A new type of community-created content.
- Additional advertising and monetization opportunities.

## 9. Final Thoughts

Minecraft Bedrock has a large addon community, but managing multiple addons is still considerably less convenient than managing mods on Java Edition.

Addonpacks could bridge this gap by bringing the same profile-based management experience to Bedrock, while using the game's existing world template system to simplify installation and reuse.

Most importantly, this would not require addon creators to change how they currently publish their projects. CurseForge would handle the organization and packaging, while the original addon projects would continue receiving downloads and rewards.

I believe this would be a valuable addition to CurseForge and a significant improvement to the Minecraft Bedrock addon experience.