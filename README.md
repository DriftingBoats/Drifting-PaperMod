# Drifting-PaperMod

Personalized [Hugo-PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme used by [Drifting Boats](https://blog.drifting.boats/).

## Requirements

- Hugo Extended >= `0.146.0`

## Install (Git Submodule)

```bash
git submodule add --depth=1 https://github.com/DriftingBoats/Drifting-PaperMod.git themes/Drifting-PaperMod
git submodule update --init --recursive
```

## Enable Theme

```yaml
theme:
  - Drifting-PaperMod
```

## Update Theme in Site Repo

```bash
git submodule update --remote --merge themes/Drifting-PaperMod
git add themes/Drifting-PaperMod
git commit -m "theme: update Drifting-PaperMod"
git push
```

## Development

```bash
git clone https://github.com/DriftingBoats/Drifting-PaperMod.git
```