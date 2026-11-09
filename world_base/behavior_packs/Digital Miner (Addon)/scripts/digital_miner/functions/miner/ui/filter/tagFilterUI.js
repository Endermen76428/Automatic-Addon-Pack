import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { apiWarn } from "../../../../lib/player/warn";
import { filterDigitalMiner } from "../../filter";
import { minerUIFilter } from "./mainFilterUI";
import { customTags } from "../tagList";
export const minerUIFilterTag = new class MinerUIFilterTag {
    filterTagScreen(player, block, center) {
        new ActionFormData()
            .title("ui.digital_miner:miner.filter")
            .button("ui.digital_miner:miner.filter.add_tag.select")
            .button("ui.digital_miner:miner.filter.add_tag.write")
            .divider()
            .label("ui.digital_miner:miner.filter.add_tag.write.custom")
            .show(player).then(({ canceled, selection }) => {
            if (canceled || selection == undefined)
                return minerUIFilter.filterScreen(player, block, center);
            if (selection == 0)
                return this.select(player, block, center);
            if (selection == 1)
                return this.write(player, block, center);
        });
    }
    write(player, block, center) {
        new ModalFormData()
            .title("ui.digital_miner:miner.filter.add_tag.write")
            .textField("ui.digital_miner:miner.filter.add_tag.write.text", "ui.digital_miner:miner.filter.add_tag.write.text_hold")
            .show(player).then(({ canceled, formValues }) => {
            const [rawTag] = formValues ?? [];
            if (canceled || formValues == undefined || typeof rawTag != "string")
                return minerUIFilter.filterScreen(player, block, center);
            if (!rawTag.trim())
                return apiWarn.notify(player, "warn.digital_miner:miner.filter.invalid_text", { sound: "warn.digital_miner:bass" });
            const tagWithPrefix = (!rawTag.includes(":") ? "bedrock_awakening:" : "") + rawTag.trim().toLocaleLowerCase();
            const tag = customTags[tagWithPrefix] ? tagWithPrefix : rawTag.trim().toLocaleLowerCase();
            if (filterDigitalMiner.addTag(player, center, tag))
                return minerUIFilter.filterScreen(player, block, center);
            return;
        });
    }
    select(player, block, center) {
        const tags = Object.keys(customTags);
        const form = new ActionFormData()
            .title("ui.digital_miner:miner.filter.add_tag.select")
            .body("ui.digital_miner:miner.filter.add_tag.select.body");
        tags.forEach(value => { form.button({ "rawtext": [{ "translate": "ui.digital_miner:tag." + value }, { "text": "\n§7" + value }] }); });
        form.show(player).then(({ canceled, selection }) => {
            if (canceled || selection == undefined)
                return minerUIFilter.filterScreen(player, block, center);
            const selected = tags[selection];
            if (!selected)
                return;
            filterDigitalMiner.addTag(player, center, selected);
            minerUIFilter.filterScreen(player, block, center);
        });
    }
};
